/*
 * same class as in sys-src/server/src/types
 * Is tested there
 */

export enum cellState {
  empty = 0,
  ship,
  shotShip,
  shotEmpty,
  blocked,
}

//to init a battlefield object
export function createEmptyGrid(gridSize: number) : cellState[][] {
  return Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(cellState.empty));
}

export class Battlefield {
  length: number;
  width: number;
  amountShips: number;
  grid: cellState[][];

  constructor(grid: cellState[][]) {
    this.grid = grid;
    this.length = grid.length;
    this.width = grid[0].length;
    this.amountShips = this.getamountCellState(cellState.ship);
  }

  getCell(x: number, y: number): cellState | undefined {
    if(x < 0 || x >= this.length) return;
    if(y < 0 || y >= this.length) return;
    return this.grid[y][x];
  }

  setCell(x: number, y: number, newCell: cellState): boolean {
    if(x < 0 || x >= this.length) return false;
    if(y < 0 || y >= this.length) return false;
    if(newCell == cellState.ship)this.amountShips++;
    this.grid[y][x] = newCell;
    return true;
  }
 

  receiveShot(x: number, y: number): boolean {
    const shotField: cellState | undefined = this.getCell(x,y);
    if(shotField === undefined) return false;
    let cellSet : boolean = false;
    switch (shotField) {
      case cellState.empty:
        cellSet = this.setCell(x,y,cellState.shotEmpty);
        break;
      case cellState.ship:
        cellSet = this.setCell(x,y,cellState.shotShip);
        this.amountShips--;
        break;
    }
    return cellSet;
  }

  getamountCellState(cellstate: cellState): number {
    let amountCellState: number = 0;
    for (let i = 0; i < this.length; i++) {
      for (let u = 0; u < this.width; u++) {
        if (this.grid[i][u] == cellstate) {
          amountCellState++;
        }
      }
    }
    return amountCellState;
  }

  gameEnded(): boolean {
    return this.amountShips == 0;
  }

  cellShootable(x: number, y: number) : boolean{
    if(this.getCell(x,y) == cellState.shotEmpty || this.getCell(x,y) == cellState.shotShip)return false;
    return true;
  }
}