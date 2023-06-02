import { useFieldStore } from '@/stores/field'

// check if passed mouse position is inside the game field
export function onField(x: number, y: number) {
  const field = document.getElementById('game-field')

  if (field) {
    const { x: posX, y: posY } = field.getBoundingClientRect()

    if (
      x >= posX &&
      x < posX + field.offsetWidth - 1 &&
      y >= posY - 1 &&
      y <= posY + field.offsetHeight + 1
    ) {
      return true
    }
  }
  return false
}

// save position of ship in game field
export function savePositions(x: number, y: number, size: number, orientation: string) {
  const store = useFieldStore() // Use the store

  for (let i = 0; i < size; i++) {
    if (orientation === 'h') {
      store.setPos(x + i, y)
    } else {
      store.setPos(x, y + i)
    }
  }
}

// remove position of ship inside the game field store
export function cleanUpStore(x: number, y: number, size: number, orientation: string) {
  const store = useFieldStore() // Use the store

  for (let i = 0; i < size; i++) {
    if (orientation === 'h') {
      store.removePos(x + i, y)
    } else {
      store.removePos(x, y + i)
    }
  }
}

// check if passed position is valid
export function validatePos(x: number, y: number, size: number, orientation: string): boolean {
  const store = useFieldStore() // Use the store

  // Check if new position conflicts with any existing positions
  let isConflict = false
  for (let i = 0; i < size; i++) {
    if (orientation === 'h') {
      isConflict = store.field.some((pos: any) => pos.x === x + i && pos.y === y)
    } else {
      isConflict = store.field.some((pos: any) => pos.x === x && pos.y === y + i)
    }
    if (isConflict) return false
  }

  if (orientation === 'h' && x + size > 11) {
    return false
  } else if (orientation === 'v' && y + size > 11) {
    return false
  } else return true
}

// ----------------------------------------------------------------
// This function extracts the table cell which is used as game field.
// ----------------------------------------------------------------
export function getElementBelowPosition(x: number, y: number): HTMLElement | null {
  const topElement: any = document.elementFromPoint(x, y)
  topElement.style.visibility = 'hidden' // Hide the top element

  const belowElement = document.elementFromPoint(x, y) // Get the element below
  topElement.style.visibility = '' // Show the top element again

  if (belowElement && belowElement.classList.contains('battlefield-cell')) {
    return belowElement.getElementsByClassName('battlefield-cell-content')[0] as HTMLElement
  } else {
    return belowElement as HTMLElement
  }
}

// ----------------------------------------------------------------
// This function marks the cells of the game field depending on the
// ship size and orientation.
// ----------------------------------------------------------------
export function markElements(
  x: number,
  y: number,
  size: number,
  orientation: string
): HTMLElement[] {
  const eles = []
  if (orientation === 'h') {
    for (let i = 0; i < size; i++) {
      eles.push(document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`))
    }
  } else {
    for (let i = 0; i < size; i++) {
      eles.push(document.querySelector(`[data-y="${y + i}"][data-x="${x}"]`))
    }
  }
  return eles
}

// ----------------------------------------------------------------
// This function cleans up the marked elements.
// ----------------------------------------------------------------
export function cleanUpElements(eles: HTMLElement[]): void {
  eles.forEach((ele) => {
    if (ele) {
      ele.style.backgroundColor = ''
    }
  })
}

// ----------------------------------------------------------------
// This function gets the position of the ship.
// ----------------------------------------------------------------
export function getPos(ref: HTMLDivElement): { x: number; y: number } {
  const left = ref.getBoundingClientRect().left
  const top = ref.getBoundingClientRect().top
  return {
    x: left,
    y: top
  }
}
