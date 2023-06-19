<template>
  <Lobby
    v-if="state === clientGameState.inlobby"
    :rooms="roomData"
    :userName="userName"
    :serverAvailable="serverAvailable"
    @createRoom="createRoom"
    @joinRoom="joinRoom"
  />
  <Preparation
    v-if="state === clientGameState.preparation || state === clientGameState.prepared"
    @completePreparation="completePreparation"
    :amountShips="amountShips"
    :battlefieldSize="battlefieldSize"
    @endGame="endGame"
    />
  <Game
    v-if="state === clientGameState.ingame"
    :userName="userName"
    :enemyName="enemyName"
    :myTurn="myTurn"
    :myBattlefield="myBattlefield"
    :enemyBattlefield="enemyBattlefield"
    :state="state"
    @shoot="shoot"   
    @endGame="endGame"
  />
  <div v-if="state === clientGameState.won || state === clientGameState.lost">
    <p v-if="state === clientGameState.won">Sie haben gegen {{ enemyName }} gewonnen</p>
    <p v-else>Sie haben gegen {{ enemyName }} verloren</p>
    <button @click="endGame()">Zur Lobby</button>
  </div>
  <div v-if="state === clientGameState.timeout">
    <p> Sie haben zu lange für die letzte Aktion gebraucht</p>
    <button @click="state=clientGameState.inlobby">Zur Lobby</button>
  </div>
</template>

<script setup lang="ts">
//#region imports
import { ref } from 'vue';
import { io } from 'socket.io-client';
import Lobby from '../components/game/Lobby.vue';
import Preparation from '@/views/HomeView.vue'
import Game from '../components/game/Game.vue';
import type { PublicRoomData } from '@/types/publicRoomData';

import {clientGameState} from '@/types/clientGameState'
import { SocketRoom } from '@/types/socketRoom';
import { Battlefield, createEmptyGrid, cellState } from '@/types/battlefield';
import { socketError } from '@/types/socketError';
import { useFieldStore } from '@/stores/field';


//#endregion imports
const url = 'http://localhost:3000';
let socket = io(url);

//server is available
let serverAvailable = ref<boolean>(true);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();

let state = ref<clientGameState>(clientGameState.inlobby);
const userName = ref<string>(getRandomName());
const enemyName = ref<string>();

const battlefieldSize = 11;
const amountShips = 30;

//true if its your turn to shoot
let myTurn = ref<Boolean>(false);

let myBattlefield = ref<Battlefield>();
let enemyBattlefield = ref<Battlefield>();

let timeoutId;
const preparationTimeout : number = 5 * 60 * 1000;
const gameTimeout : number = 1 * 60 * 1000;

window.onbeforeunload = (event) => endGame();

//#region subscribe

//if the client connects succesfully to the server
socket.on('connect', ()=> {
  serverAvailable.value = true;
});

//if there a connection error with the server
socket.on('connect_error', ()=> {
  console.error("Error");
  endGame();
  serverAvailable.value = false;
});

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

socket.on(SocketRoom.gameStarted, (currentPlayerName: string, enemyPlayerName: string) => {
  endTimer(); //from Game Preparation
  console.log('gamestarted');
  enemyName.value = enemyPlayerName;

  //constructor, otherwise received battlefield is recognized as object
  enemyBattlefield.value = new Battlefield(createEmptyGrid(battlefieldSize));
  console.log('Default Enemy Battlefield: ' + enemyBattlefield.value.grid);

  if (currentPlayerName == userName.value) {
    myTurn.value = true;
  } else {
    myTurn.value = false;
  }
  state.value = clientGameState.ingame;
  startTimer();
});

//shot from enemy
socket.on(SocketRoom.receivedShot, (x: number, y: number) => {
  console.log('Shot by enemy x: ' + x + ' y:' + y);
  if (myTurn.value == false) {
    //applies shot to my local battlefield
    myBattlefield.value!.receiveShot(x, y);
    console.log('My new Battlefield value:' + myBattlefield.value?.grid);

    endTimer();
    //checks if I have been defeated
    if (myBattlefield.value!.gameEnded()) {
      console.log('You ' + 'lost');
      state.value = clientGameState.lost;
      //socket.disconnect();
    } else {
      myTurn.value = true;
      startTimer();
    }
  }
});

//Received Error from Server
socket.on(SocketRoom.errorThrown, (error : socketError) => {
  //only handled error is aborted
  if(error == socketError.aborted){
    switch(state.value){
      case clientGameState.ingame:
        console.error("Other player aborted");
        state.value = clientGameState.won;
        break;
      default:
        state.value = clientGameState.inlobby;
        endGame();
    }
  }
} )

//response to shot to enemy
socket.on(SocketRoom.responsetoShot, (x: number, y: number, changedCell: cellState) => {
  if (myTurn.value) {
    //could save x and y and check if the server return the right x and y

    enemyBattlefield.value!.setCell(x, y, changedCell);
    console.log('New value enemy battlefied known: ' + enemyBattlefield.value?.grid);

    if (enemyBattlefield.value?.getamountCellState(cellState.shotShip) == amountShips) {
      console.log('You won');
      state.value = clientGameState.won;
      //socket.disconnect();
    }
    myTurn.value = false;
    startTimer();
  } else {
    console.error("Received Response, but it's not my turn");
    socket.emit(
      SocketRoom.clientError,
      currentRoomId.value,
      userName.value,
      socketError.gameSequenceError,
    );
  }
});
//#endregion subscribe


//#region publish

//creates room and the joins it
function createRoom() {
  console.log('create room');
  const uniqueRoomId: string = Date.now().toString() + Math.random().toString(36).slice(2);
  socket.emit(SocketRoom.roomCreated, uniqueRoomId, userName.value);

  joinRoom(uniqueRoomId);
}

//joins the room, starts the preparation
function joinRoom(roomId: string) {
  console.log('join room' + roomId);
  currentRoomId.value = roomId;
  state.value = clientGameState.preparation;

  socket.emit(SocketRoom.roomJoined, roomId, userName.value);
  startTimer(); //until both players are configured
}

//starts the Game
function completePreparation(battlefield: Battlefield) {
    myBattlefield.value = battlefield as Battlefield;
    console.log('Preparation completed, my battlefield:' + myBattlefield.value.grid);
    state.value = clientGameState.prepared;
    socket.emit(SocketRoom.preparationCompleted, currentRoomId.value, userName.value, battlefield);
}

//needs to get x and y from Game.vue
function shoot(x: number, y: number) {
  endTimer();
  if (myTurn.value) {
    console.log('Shot at x: ' + x + ' y: ' + y);
    socket.emit(SocketRoom.Shot, currentRoomId.value, userName.value, x, y);
  } else {
    console.error("Tried to shot, but it's not my turn");
    socket.emit(
      SocketRoom.clientError,
      currentRoomId.value,
      userName.value,
      socketError.gameSequenceError,
    );
  }
}

function startTimer(){
  let timeBeforeTimeout : number = 0;
  switch (state.value){
    case(clientGameState.preparation):
      timeBeforeTimeout = preparationTimeout;
      break;
    case(clientGameState.ingame):
      timeBeforeTimeout = gameTimeout;
  }
  timeoutId = setTimeout(timeout, timeBeforeTimeout);
}

function endTimer(){
  clearTimeout(timeoutId);
}

function timeout(){
  switch(state.value){
    case(clientGameState.preparation):
      console.log("Preparation Timeout, no other player is coming");
      endGame();
      state.value =clientGameState.timeout;
      break;
    case(clientGameState.prepared):
      console.log("Preparation Timeout, no other player is coming");
      endGame();
      state.value = clientGameState.timeout;
      break;
    case(clientGameState.ingame):
      if(myTurn.value){
        console.log("Timeout, I took to long to shot");
        endGame();
        state.value = clientGameState.timeout;
      } else{
        console.log("Timeout, the other player took to long to shoot -> game will be aborted");
      }
      break;
  }
}

//actions that after a ended game, a new game could start
function endGame(){
  const field = useFieldStore();
  field.clear();

  state.value = clientGameState.inlobby;
  //to leave the room
  socket.disconnect();
  //if not reloaded, to connect again
  socket.connect();
}

//#endregion publish

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}
</script>
