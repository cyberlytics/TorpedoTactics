<template>
    <Lobby v-if="!currentRoomId"
      :rooms="roomData" :userName="userName"
      @createRoom="createRoom" @joinRoom="joinRoom"
    />
    <Game v-else
      :userName="userName" :publicGameMetadata="publicGameMetadata"
      @completePreparation="completePreparation"
    />
</template>

<script setup lang="ts">
//#region imports
import { ref } from 'vue';
import { io } from 'socket.io-client';
import Lobby from '../components/game/Lobby.vue';
import Game from '../components/game/Game.vue';
import type { PublicGameMetadata } from '@/types/publicGameMetadata';
import type { PublicRoomData } from '@/types/publicRoomData';
import { SocketRoom } from '@/types/socketRoom';
import { Battlefield, cellState } from '@/types/battlefield';
//#endregion imports

const url = 'http://localhost:3000';
const socket = io(url);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();
const publicGameMetadata = ref<PublicGameMetadata>();
const userName = ref<string>(getRandomName());

const battlefieldSize : number = 11;

//#region subscribe

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

socket.on(SocketRoom.preparationStarted, () =>{

});


socket.on(SocketRoom.gameStarted, () => {
   console.log("Game has been started");
});

socket.on(SocketRoom.gamedataPublished, (gameMetadata: PublicGameMetadata) => {
  publicGameMetadata.value = gameMetadata;
});

//#endregion subscribe

//#region publish

function createRoom() {
  console.log("create room");
  socket.emit(
    SocketRoom.roomCreated, 
    userName.value
  );

  joinRoom(socket.id);
}

function joinRoom(roomId: string) {
  console.log("join room");
  currentRoomId.value = roomId;

  socket.emit(
    SocketRoom.roomJoined,
    roomId, userName.value
  );
}

function completePreparation(){
  console.log("start game");
  socket.emit(
    SocketRoom.preparationCompleted,
    currentRoomId.value,
    userName.value,
    getRandomBattlefied(),
  );
}

//#endregion publish

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}

function getRandomBattlefied() : Battlefield{
  const randomGrid : cellState[][] =  Array.from({ length: battlefieldSize }, () =>
    Array.from({ length: battlefieldSize }, () => getRandomCellState())
  );
  return new Battlefield(randomGrid);
}

function getRandomCellState() : cellState {
  const values = [cellState.empty, cellState.ship];
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

</script>