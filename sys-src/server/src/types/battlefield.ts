export enum cellState {
    empty = 0,
    ship,
    shotShip,
    shotEmpty,
    blocked,
}

export class Battlefield{
    length: number;
    width: number;
    grid: cellState[][];

    constructor(grid: cellState[][]){
        this.grid = grid;
        this.length = grid.length;
        this.width = grid[0].length;
    }

}