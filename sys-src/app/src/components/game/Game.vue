<template>
  <div class="enemies">
    <h3>enemy: {{ enemyName }}</h3>
  </div>
  <div class="table">
    <p v-if="myTurn">Du bist dran</p>
    <p v-else>Es ist nicht dein Zug</p>
    <Game :battlefield="myBattlefield"/>
    <Game :battlefield="enemyBattlefield" :clickable="true" @shoot="shoot"/>
  </div>
  <div class="player">
    <h3>player: {{ userName }}</h3>
    <button @click="leaveGame()"> Spiel verlassen</button>
  </div>
</template>

<script setup lang="ts">
//#region imports
import { defineComponent, ref } from 'vue';
import { Battlefield } from '@/types/battlefield';
import Game from '@/components/Game-Field.vue'; 

//#endregion imports

const props = defineProps({
  userName: String,
  enemyName: String,
  myTurn: Boolean,
  myBattlefield: Battlefield,
  enemyBattlefield: Battlefield,
  state: Number,
});

defineComponent({
  components: {Game}
})

const emit = defineEmits(['shoot','endGame']);

/*function completePreparation() {
  emit('completePreparation', getRandomBattlefied());
}*/

function shoot(x : number, y: number) {
  emit('shoot',x,y);
}

function leaveGame(){
  emit('endGame');
}

</script>

<style>
body > div {
  position: absolute;
  inset: 0;
}

.enemies {
  position: absolute;
  inset: 0 0 auto 0;

  border: solid 2px turquoise;
  height: 100px;
}

.player {
  position: absolute;
  inset: 600px 0 0 0;

  border: solid 2px orange;
  height: 100px;
}

.table {
  position: absolute;
  inset: 100px 0 100px 0;
  border: solid 2px green;
}
</style>
