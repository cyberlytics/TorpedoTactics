<template>
  <div>
    <div v-if="statsForUser">
      <h1> Stats for {{ userName }}</h1>
      <p> Hit/Missrate: {{ statsForUser.hits / (statsForUser.hits + statsForUser.misses) }}%</p>
      <p> Won Games: {{statsForUser.gameswon}}</p>
      <p> Lost Games: {{statsForUser.gamesplayed - statsForUser.gameswon}}</p>
      <div>
        <h2>Ratio</h2>
        <div style="display: flex;">
          <div>{{ percentageWon* 100 }}%</div>
          <div class="gewonnen-balken" :style="{width: percentageWon*100 + '%'}"></div>
          <div class="verloren-balken" :style="{ width: percentageLost*100 + '%'}"></div>
          <div>{{ percentageLost * 100}}%</div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Stats for {{ userName }} are not available</h1>
    </div>
    <button @click="endStats"> Leave Stats</button>
  </div>
</template>

<script setup lang="ts">

import axios from 'axios';
import {ref} from 'vue';
import {stats} from '@/types/stats';

const probs = defineProps({
  userName :String,
  serverAdr : String,
})
let statsForUser = ref<stats>();
let percentageWon = ref<number>();
let percentageLost = ref<number>();

const emit = defineEmits(['endStats']);

async function getStats<stats>(name: string){
  await axios.get("http://"+probs.serverAdr+'/api/stats',{
    params: {
      username: name,
    }
  }).then(response =>{
    statsForUser.value = response.data;
    percentageWon.value = statsForUser.value?.gameswon! / statsForUser.value?.gamesplayed!;
    percentageLost.value = 1 - percentageWon.value;
  }).catch(error => {
    statsForUser.value = undefined;
    console.error("Statistiken für "+probs.userName+ " konnten nicht abgerufen werden");
  })
};

function endStats(){
  emit('endStats');
}

//fetches the stats for the user who opened the component
getStats(probs.userName!);
</script>

<style>


.gewonnen-balken {
  background-color: green;
  height: 10px;
}

.verloren-balken {
  background-color: red;
  height: 10px;
}
</style>
