<template>
  <div>
    <h3>{{ userName }}</h3>
    <hr />
    <br />

    <h2>Create</h2>
    <br />
    <button @click="createRoom()">Create room</button>
    <br /><br />
    <!-- <hr> -->
    <br />

    <h2>Open Rooms</h2>
    <ul>
      <li v-for="room in props.rooms" :key="room.id">
        <div>Name: {{ room.name }}</div>
        <button @click="joinRoom(room.id)">Join</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
//#region imports
import type { PublicRoomData } from '@/types/publicRoomData';
//#endregion imports

const props = defineProps({
  rooms: Array<PublicRoomData>,
  userName: String,
});
const emit = defineEmits(['createRoom', 'joinRoom','abort']);

function createRoom() {
  emit('createRoom');
}

function joinRoom(roomId: string) {
  emit('joinRoom', roomId);
}

</script>
