<template>
    <Lobby v-if="!currentRoomId"
      :rooms="roomData" :userName="userName"
      @createRoom="createRoom" @joinRoom="joinRoom"
    />
    <Game v-else
      :userName="userName" :publicGameMetadata="publicGameMetadata"
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
//#endregion imports

const url = 'http://localhost:3000';
const socket = io(url);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();
const publicGameMetadata = ref<PublicGameMetadata>();
const userName = ref<string>(getRandomName());


//#region subscribe

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

socket.on(SocketRoom.gameStarted, () => {
  // do something
});

socket.on(SocketRoom.gamedataPublished, (gameMetadata: PublicGameMetadata) => {
  publicGameMetadata.value = gameMetadata;
});

//#endregion subscribe

//#region publish

function createRoom() {
  socket.emit(
    SocketRoom.roomCreated, 
    userName.value
  );

  joinRoom(socket.id);
}

function joinRoom(roomId: string) {
  currentRoomId.value = roomId;

  socket.emit(
    SocketRoom.roomJoined,
    roomId, userName.value
  );
}

//#endregion publish

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}

</script>