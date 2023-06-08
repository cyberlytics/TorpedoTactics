/*
 * @vitest-environment happy-dom
 * */

import { it, describe, expect, beforeEach, vi } from 'vitest'
import jest, { render, fireEvent } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

// components
// @ts-ignore
import HomeView from '@/views/HomeView.vue'

// store
import { useFieldStore } from '@/stores/field'

describe('HomeView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders game field and ships', async () => {
    const dom: any = render(HomeView)

    const field = await jest.queryByAttribute('id', dom.container, 'game-field')

    expect(field).toBeTruthy()

    // Assert that 10 ships are present
    const ships = dom.container.getElementsByClassName('ship')
    expect(ships).toHaveLength(10)
  })

  it('allows dragging a ship onto the game field', async () => {
    const field = useFieldStore()
    const dom: any = render(HomeView)

    const ship = jest.queryByAttribute('id', dom.container, 'ship-1')
    const gameField = jest.queryByAttribute('id', dom.container, 'game-field')

    expect(ship).toBeTruthy()
    expect(gameField).toBeTruthy()

    // Drag and drop
    if (!ship) throw new Error('ship must be defined')
    if (!gameField) throw new Error('game field must be defined')

    // @ts-ignore
    document.elementFromPoint = vi.fn(() => dom.container.querySelector('[data-x="0"][data-y="0"]'))

    //
    await fireEvent.mouseDown(ship)
    await fireEvent.mouseMove(ship)
    await fireEvent.mouseUp(ship)

    expect(field.field).toHaveLength(5)
    expect(field.field).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 }
    ])
  })

  it('should change ship orientation on game field', async () => {
    const field = useFieldStore()
    const { container }: any = render(HomeView)

    const ship = jest.queryByAttribute('id', container, 'ship-1')
    const gameField = jest.queryByAttribute('id', container, 'game-field')

    expect(ship).toBeTruthy()
    expect(gameField).toBeTruthy()

    // Drag and drop
    if (!ship) throw new Error('ship must be defined')
    if (!gameField) throw new Error('game field must be defined')

    // @ts-ignore
    document.elementFromPoint = vi.fn(() => container.querySelector('[data-x="0"][data-y="0"]'))

    // drag and drop the ship on field
    await fireEvent.mouseDown(ship)
    await fireEvent.mouseMove(ship)
    await fireEvent.mouseUp(ship)

    // TODO fix it
    await fireEvent.click(ship)
    await fireEvent.click(ship)

    expect(field.field).toHaveLength(5)
    expect(field.field).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 }
    ])
  })
})
