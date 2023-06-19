<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import Game from '@/components/Game-Field.vue';
import Ship from '@/components/Ship.vue';
import { Battlefield, cellState, createEmptyGrid } from '@/types/battlefield';
import { useFieldStore } from '@/stores/field'
import { clientGameState } from '@/types/clientGameState';


const props = defineProps({
    amountShips: Number,
    battlefieldSize: Number
})

const emit = defineEmits(['completePreparation','endGame']);

//if false the battlefield has to be confirmed
let battlefieldConfirmed = ref<Boolean>(false);
//true if the the first battlefield was confirmed, game will then be started if the opponent is ready
let firstBattlefieldConfirmed = ref<Boolean>(false);

//stores the positions of the ship
const store = useFieldStore();

const ships = ref([
  { id: 'ship-1', size: 5, x: 0, y: 0},
  { id: 'ship-2', size: 4, x: 0, y: 0},
  { id: 'ship-3', size: 4, x: 0, y: 0},
  { id: 'ship-4', size: 3, x: 0, y: 0},
  { id: 'ship-5', size: 3, x: 0, y: 0},
  { id: 'ship-6', size: 3, x: 0, y: 0},
  { id: 'ship-7', size: 2, x: 0, y: 0},
  { id: 'ship-8', size: 2, x: 0, y: 0},
  { id: 'ship-9', size: 2, x: 0, y: 0},
  { id: 'ship-10', size: 2, x: 0, y: 0}
]);

onMounted(() => {
  nextTick(() => {
    const gamefield = document.getElementById('game-field');
    if (!gamefield) return;
    let bottomMargin = 30; // Bottom margin

    let gameFieldWidth = gamefield.clientWidth + 100;

    const { top } = gamefield.getBoundingClientRect();

    // Position ships beside game field
    let currentTop = top - 65;
    ships.value = ships.value.map((ship) => {
      let x = gameFieldWidth;
      let y = currentTop;

      currentTop += ship.size + bottomMargin; // Add bottom margin

      return { ...ship, x, y };
    });
  });
});

function confirmBattlefield(){
    firstBattlefieldConfirmed.value = true;
    battlefieldConfirmed.value = true;
    emit('completePreparation', createBattlefieldFromStore(store));
}

function createBattlefieldFromStore(mystore : any) : Battlefield{
    const newbattlefield : Battlefield = new Battlefield(createEmptyGrid(props.battlefieldSize!))
    for(let i = 0; i < mystore.field.length; i++){
        newbattlefield.setCell(mystore.field[i].x, mystore.field[i].y, cellState.ship);
    }
    return newbattlefield;
    
}

function leaveRoom(){
  emit('endGame');
}

watch(()=>store.field.length, (newVal, oldVal)=>{
  if(oldVal == props.amountShips){
    battlefieldConfirmed.value = false;
  }
}, {deep:true})
</script>

<template>
  <Game />
  <Ship
    v-for="ship in ships"
    :key="ship.id"
    :id="ship.id"
    :size="ship.size"
    :x="ship.x"
    :y="ship.y"
  />
  <button v-if="store.field.length === amountShips && battlefieldConfirmed === false"
  @click="confirmBattlefield()">Aktuelles Spielfeld übernehmen</button>
  <div v-if="firstBattlefieldConfirmed">Spielfeld bestätigt, Warten auf Gegner</div>
  <button v-if="firstBattlefieldConfirmed===false" @click="leaveRoom()">Lobby verlassen</button>
</template>