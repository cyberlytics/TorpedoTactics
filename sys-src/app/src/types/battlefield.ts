export enum cellState {
  empty = 0,
  ship,
  shotShip,
  shotEmpty,
  blocked,
}

export function createGrid(gridSize: number, amountShips: number) {
  let Grid: cellState[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(cellState.empty));
  console.log(Grid);
  let count: number = 0;
  while (count < amountShips) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);

    if (Grid[x][y] == cellState.empty) {
      Grid[x][y] = cellState.ship;
      count++;
    }
  }
  return Grid;
}

export function createEmptyGrid(gridSize: number) {
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

  getCell(x: number, y: number): cellState {
    return this.grid[y][x];
  }

  setCell(x: number, y: number, newCell: cellState): void {
    this.grid[y][x] = newCell;
  }

  receiveShot(x: number, y: number): void {
    const shotField: cellState = this.grid[y][x];
    switch (shotField) {
      case cellState.empty:
        this.grid[y][x] = cellState.shotEmpty;
        break;
      case cellState.ship:
        this.grid[y][x] = cellState.shotShip;
        this.amountShips--;
        break;
    }
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
}
