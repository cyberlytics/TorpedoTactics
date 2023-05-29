import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFieldStore = defineStore('field', () => {
  const field: any = ref([])
  function setPos(x: number, y: number) {
    console.log(x, y)
    field.value.push({ x, y })
  }

  function removePos(x: number, y: number) {
    const index = field.value.findIndex((pos: any) => pos.x === x && pos.y === y)
    console.log(index, field.value)
    if (index !== -1) {
      field.value.splice(index, 1)
    }
  }

  return { field, setPos, removePos }
})
