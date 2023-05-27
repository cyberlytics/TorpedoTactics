export enum cellState {
    empty = 0,
    ship,
    shotShip,
    shotEmpty,
    blocked,
}

export class Battlefield{
    size: number;
    grid: cellState[][]

    constructor(size:number, grid: cellState[][]){
        this.size = size;
        this.grid = grid;
    }

}