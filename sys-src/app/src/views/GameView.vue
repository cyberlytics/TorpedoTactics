<template>
  <Lobby
    v-if="!currentRoomId"
    :rooms="roomData"
    :userName="userName"
    @createRoom="createRoom"
    @joinRoom="joinRoom"
  />
  <Game
    v-else
    :userName="userName"
    :enemyName="enemyName"
    :myTurn="myTurn"
    :battlefieldSize="battlefieldSize"
    :amountShips="amountShips"
    @completePreparation="completePreparation"
    @shoot="shoot"
  />
</template>

<script setup lang="ts">
//#region imports
import { ref } from 'vue';
import { io } from 'socket.io-client';
import Lobby from '../components/game/Lobby.vue';
import Game from '../components/game/Game.vue';
import type { PublicRoomData } from '@/types/publicRoomData';
import { SocketRoom } from '@/types/socketRoom';
import { Battlefield, createEmptyGrid, cellState } from '@/types/battlefield';
import { socketError } from '@/types/socketError';
//#endregion imports

const url = 'http://localhost:3000';
const socket = io(url);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();
const userName = ref<string>(getRandomName());
const enemyName = ref<string>();

const battlefieldSize = ref<number>(2);
const amountShips = ref<number>(2);

//true if its your turn to shoot
let myTurn = ref<Boolean>(false);

let myBattlefield = ref<Battlefield>();
let enemyBattlefield = ref<Battlefield>();

//#region subscribe

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

/*delete if not used later
socket.on(SocketRoom.preparationStarted, ()=>{

});*/

socket.on(SocketRoom.gameStarted, (currentPlayerName: string, enemyPlayerName: string) => {
  console.log('gamestarted');
  enemyName.value = enemyPlayerName;

  //constructor, otherwise received battlefield is recognized as object
  enemyBattlefield.value = new Battlefield(createEmptyGrid(battlefieldSize.value));
  console.log('Default Enemy Battlefield: ' + enemyBattlefield.value.grid);

  if (currentPlayerName == userName.value) {
    myTurn.value = true;
  } else {
    myTurn.value = false;
  }
});

//shot from enemy
socket.on(SocketRoom.receivedShot, (x: number, y: number) => {
  console.log('Shot by enemy x: ' + x + ' y:' + y);
  if (myTurn.value == false) {
    //applies shot to my local battlefield
    myBattlefield.value!.receiveShot(x, y);
    console.log('My new Battlefield value:' + myBattlefield.value?.grid);

    //checks if I have been defeated
    if (myBattlefield.value!.gameEnded()) {
      console.log('You ' + 'lost');
      socket.disconnect();
    } else {
      myTurn.value = true;
    }
  }
});

//response to shot from enemy
socket.on(SocketRoom.responsetoShot, (x: number, y: number, changedCell: cellState) => {
  if (myTurn.value) {
    //could save x and y and check if the server return the right x and y

    enemyBattlefield.value!.setCell(x, y, changedCell);
    console.log('New value enemy battlefied known: ' + enemyBattlefield.value?.grid);

    if (enemyBattlefield.value?.getamountCellState(cellState.shotShip) == amountShips.value) {
      console.log('You won');
      socket.disconnect();
    }
    myTurn.value = false;
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

//received error from server
socket.on(SocketRoom.errorThrown, (thrownError: socketError) => {
  console.error('Error from server received: ' + thrownError + '. Disconnect');
  //socket.disconnect();
});

//#endregion subscribe

//#region publish

function createRoom() {
  console.log('create room');
  const uniqueRoomId: string = Date.now().toString() + Math.random().toString(36).slice(2);
  socket.emit(SocketRoom.roomCreated, uniqueRoomId, userName.value);

  joinRoom(uniqueRoomId);
}

function joinRoom(roomId: string) {
  console.log('join room' + roomId);
  currentRoomId.value = roomId;

  socket.emit(SocketRoom.roomJoined, roomId, userName.value);
}

//needs to get the battlefield from Game.vue
//starts the Game
function completePreparation(battlefield: Battlefield) {
  myBattlefield.value = battlefield as Battlefield;
  console.log('start game, my battlefield:' + myBattlefield.value.grid);
  socket.emit(SocketRoom.preparationCompleted, currentRoomId.value, userName.value, battlefield);
}

//needs to get x and y from Game.vue
function shoot(x: number, y: number) {
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

//#endregion publish

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}
</script>
