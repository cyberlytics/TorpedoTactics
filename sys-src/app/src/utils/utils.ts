export function validatePos(x: number, y: number, size: number, orientation: string): boolean {
  // TODO needs to be extended
  if (orientation === 'h' && x + size - 1 > 10) {
    return false
  }
  return !(orientation === 'v' && y + size - 1 > 10)
}

// ----------------------------------------------------------------
// This function extracts the table cell which is used as game field.
// ----------------------------------------------------------------
export function getElementBelowPosition(x: number, y: number): HTMLElement | null {
  const topElement: any = document.elementFromPoint(x, y)
  topElement.style.visibility = 'hidden' // Hide the top element

  const belowElement = document.elementFromPoint(x, y) // Get the element below
  topElement.style.visibility = '' // Show the top element again

  return belowElement as HTMLElement
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
