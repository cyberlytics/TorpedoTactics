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
    amountShips : number;
    grid: cellState[][];

    constructor(grid: cellState[][]){
        this.grid = grid;
        this.length = grid.length;
        this.width = grid[0].length;
         this.amountShips = this.getamountShips();
    }

    receiveShot(x: number, y: number){
        const shotField : cellState = this.grid[y][x];
        switch(shotField){
            case cellState.empty:
                this.grid[y][x] = cellState.shotEmpty;
                break;
            case cellState.ship:
                this.grid[y][x] = cellState.shotShip;
                this.amountShips--;
                break;
        }
    }

    getamountShips() : number{
        let amountShips : number = 0;
        for(let i = 0; i < this.length; i++){
            for(let u = 0; u < this.width; u++){
                if(this.grid[i][u] == cellState.ship){
                    amountShips++;
                }
            }
        }
        return amountShips;
    }

    gameEnded() : boolean{
        return (this.amountShips == 0);
    }

}