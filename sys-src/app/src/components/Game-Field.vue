<script setup lang="ts">
import { ref} from 'vue'
import { Battlefield, cellState} from '@/types/battlefield'


const rows = ref(11) // Number of rows including the markers row
const cols = ref(11) // Number of columns including the markers column


const emit = defineEmits(['shoot']);

const getColLetter = (i: any) => String.fromCharCode(65 + i) // 65 is the ASCII value for 'A'

const click = (e: any) => {
  if(!props.clickable || !props.battlefield?.cellShootable(e.target.dataset.x,e.target.dataset.y))return;
  emit('shoot', e.target.dataset.x, e.target.dataset.y);
  console.log("Clicked "+ e.target.dataset.x + "  "+ e.target.dataset.y);
}

function getCellStyle(x : number, y: number){
  let cellStyle = '';
  switch(props.battlefield?.getCell(x-1, y-1)){
    case cellState.ship:
      cellStyle = 'battlefield-cell__ship'; 
      break;
    case cellState.shotShip:
      cellStyle = 'battlefield-cell__shotship';
      break;
    case cellState.shotEmpty:
      cellStyle = 'battlefield-cell__shotempty';
  }
  return cellStyle;
}

const props = defineProps({
    battlefield: Battlefield,
    clickable:{
      type: Boolean,
      required: false,
    },
    cellStyle: String,
});

</script>

<template>
  <div class="battlefield-table-wrapper">
    <table id="game-field">
      <tbody>
        <tr v-for="y in rows" :key="y" class="battlefield-row">
          <td v-for="x in cols" :key="x" class="battlefield-cell battlefield-cell__empty">
            <div class="battlefield-cell-content" :class="getCellStyle(x,y)" :data-y="y - 1" :data-x="x - 1" @click="click">
              <div v-if="x === 1" class="marker marker__row">{{ y }}</div>
              <div v-if="y === 1" class="marker marker__col">{{ getColLetter(x - 1) }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0;
  cursor: default;
  display: inline-block;
  position: relative;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

tr {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

.battlefield-table-wrapper {
  min-height: 340px;
  min-width: 340px;
  display: inline-block;
  margin: 3em 2em;
}

.battlefield-cell {
  border: 1px solid #b49fcc;
  padding: 0;
}

.battlefield-cell-content {
  position: relative;
  height: 2em;
  width: 2em;
}

.battlefield-cell__ship{
  background-color: aliceblue;
}

.battlefield-cell__shotship{
  background-color: red;
}

.battlefield-cell__shotempty{
  background-color: gray;
}

.marker__row {
  left: -3em;
  width: 2em;
  text-align: right;
  top: 1em;
  height: 1em;
}

.marker {
  position: absolute;
  font-size: 11px;
  z-index: -1;
  color: white;
  font-weight: bold;
}

.marker__col {
  top: -2em;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>
