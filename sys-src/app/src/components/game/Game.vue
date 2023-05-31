<template>
    <div class="enemies">
        <h3>enemy: {{ enemyName }}</h3>
    </div>
    <div class="table">
        <p v-if="myTurn">Du bist dran</p>
        <p v-else>Es ist nicht dein Zug</p>
        <button @click="completePreparation()">Ready</button>
        <button @click="shoot()">Shoot</button>
    </div>
    <div class="player">
        <h3>player: {{ userName }}</h3>
    </div>
</template>


<script setup lang="ts">
//#region imports
import { Battlefield, cellState, createGrid } from '@/types/battlefield';
import { computed } from 'vue';
//#endregion imports



const props = defineProps({
    userName: String,
    enemyName: String,
    myTurn: Boolean,
    battlefieldSize: Number,
    amountShips: Number,
});

/* Delete later
const enemy = computed(() => {
    const enemy = props.publicGameMetadata?.playersData
        .filter((player) => player.name != props.userName)[0].name;
  
    return enemy;
});*/

const emit = defineEmits(['completePreparation','shoot']);


function completePreparation() {
  emit('completePreparation', getRandomBattlefied());
}

function shoot(){
    emit('shoot', Math.floor(Math.random() * (props.battlefieldSize!)), Math.floor(Math.random() * (props.battlefieldSize!)))
}


//Helper Functions, remove later
function getRandomBattlefied() : Battlefield{
  return new Battlefield(createGrid(props.battlefieldSize!, props.amountShips!));
}

/* Not needed, delete later
function getRandomCellState() : cellState {
  const values = [cellState.empty, cellState.ship];
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}*/
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
    inset: auto 0 0 0;
    
    border: solid 2px orange;
    height: 100px;
}


.table {
    position: absolute;
    inset: 100px 0 100px 0;
    border: solid 2px green;
}
</style>