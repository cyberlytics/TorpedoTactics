import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFieldStore = defineStore('field', () => {
  const field: any = ref([])
  function setPos(x: number, y: number) {
    field.value.push({ x, y })
  }

  return { field, setPos }
})
