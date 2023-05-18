<script setup lang="ts">
import { ref } from 'vue'

const rows = ref(11) // Number of rows including the markers row
const cols = ref(11) // Number of columns including the markers column

const getColLetter = (i: any) => String.fromCharCode(65 + i) // 65 is the ASCII value for 'A'

const drop = (e: any) => {
  console.log(e)
  const ship_id = e.dataTransfer.getData('ship_id')

  const ship = document.getElementById(ship_id)

  if (ship) {
    ship.style.display = 'block'

    ship.style.left = e.target.offsetLeft + 2 + 'px'
    ship.style.top = e.target.offsetTop + 2 + 'px'

    e.target.appendChild(ship)
  }
}
</script>

<template>
  <div class="battlefield-table-wrapper">
    <table @dragover.prevent @drop.prevent="drop" id="game-field">
      <tbody>
        <tr v-for="y in rows" :key="y" class="battlefield-row">
          <td v-for="x in cols" :key="x" class="battlefield-cell battlefield-cell__empty">
            <div class="battlefield-cell-content" :data-y="y - 1" :data-x="x - 1">
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
