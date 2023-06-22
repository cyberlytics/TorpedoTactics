<template>
  <div v-if="serverAvailable && !showStats">
    <h3>{{ userName }}</h3>
    <hr />
    <br />

    <h2>Create</h2>
    <br />
    <button @click="createRoom()">Create room</button>
    <button @click="showStats = true">Show stats for user</button>
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
  <div v-else-if="serverAvailable && showStats">
    <Stats :userName="userName" :serverAdr="serverAdr" @endStats="endStats"></Stats>
  </div>
  <div v-else>
    Keine Serververbindung möglich
  </div>
</template>

<script setup lang="ts">
//#region imports
import type { PublicRoomData } from '@/types/publicRoomData';
import {ref} from 'vue';
import Stats from '../Stats.vue'
//#endregion imports

let showStats = ref<Boolean>(false)

const props = defineProps({
  rooms: Array<PublicRoomData>,
  userName: String,
  serverAvailable: Boolean,
  serverAdr: String
});
const emit = defineEmits(['createRoom', 'joinRoom','abort']);

function createRoom() {
  emit('createRoom');
}

function joinRoom(roomId: string) {
  emit('joinRoom', roomId);
}

function endStats(){
  showStats.value = false;
}

</script>
