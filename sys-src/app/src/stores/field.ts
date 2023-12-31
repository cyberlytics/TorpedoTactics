import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFieldStore = defineStore('field', () => {
  const field: any = ref([])
  function setPos(x: number, y: number) {
    field.value.push({ x, y })
  }

  function removePos(x: number, y: number) {
    const index = field.value.findIndex((pos: any) => pos.x === x && pos.y === y)
    if (index !== -1) {
      field.value.splice(index, 1)
    }
  }

  function clear(){
    field.value = [];
  }

  return { field, setPos, clear, removePos }
})
