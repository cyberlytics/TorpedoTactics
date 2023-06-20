import {Battlefield, cellState, createEmptyGrid} from '../battlefield'

const size = 11;

describe('createEmptyGrid', ()=>{
    let grid = createEmptyGrid(size);
    it('right size', ()=>{
        expect(grid.length).toBe(size);
        expect(grid[0].length).toBe(size);
    });
    it('empty', () =>{
        let contentgrid = 0;
        for(let i = 0; i < size; i++){
            for(let u = 0; u < size; u++){
                contentgrid += grid[i][u];
            }
        }
        expect(contentgrid).toBe(0);
    });
});

describe('create Battlefield', () =>{
    it('does not throw exception', ()=> {
        expect(() => new Battlefield(createEmptyGrid(size))).not.toThrow();
    });
    it('right size', () =>{
        const battlefield = new Battlefield(createEmptyGrid(size));
        expect(battlefield.length).toBe(size);
        expect(battlefield.width).toBe(size);
    });
});

describe('getCell', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    battlefield.setCell(1,2, cellState.ship);
    it('return correct', () =>{
        expect(battlefield.getCell(1,2)).toBe(cellState.ship);
        expect(battlefield.getCell(0,0)).toBe(cellState.empty);
    })
    it('out of bounds', () =>{
        expect(battlefield.getCell(0, size)).toBeUndefined();
    });
})

describe('setCell', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    it('set correct', () =>{
        expect(battlefield.getCell(1,2)).toBe(cellState.empty);
        expect(battlefield.setCell(1,2, cellState.ship)).toBe(true);
        expect(battlefield.getCell(1,2)).toBe(cellState.ship);
        expect(battlefield.amountShips).toBe(1);
    });
    it('out of bounds', ()=>{
        expect(battlefield.setCell(size, 0, cellState.ship)).toBe(false);
        //added no other ship
        expect(battlefield.amountShips).toBe(1);
    })
});

describe('receiveShot', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    battlefield.setCell(4,4, cellState.ship);
    battlefield.setCell(5,5,cellState.ship);
    it('shot ship', ()=>{
        expect(battlefield.receiveShot(4,4)).toBe(true);
        expect(battlefield.getamountCellState(cellState.shotShip)).toBe(1);
        expect(battlefield.amountShips).toBe(1);
    });
    it('shot empty', ()=>{
        expect(battlefield.receiveShot(2,2)).toBe(true);
        expect(battlefield.getamountCellState(cellState.shotEmpty)).toBe(1);
        expect(battlefield.amountShips).toBe(1);
    });
});

describe('getamountCellState', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    battlefield.setCell(4,4, cellState.ship);
    battlefield.setCell(5,5,cellState.ship);
    battlefield.setCell(6,6, cellState.ship);
    battlefield.setCell(7,7,cellState.ship);
    battlefield.receiveShot(7,7);
    battlefield.receiveShot(3,3);
    it('get right amount cell states', ()=>{
        expect(battlefield.getamountCellState(cellState.ship)).toBe(3);
        expect(battlefield.getamountCellState(cellState.shotShip)).toBe(1);
        expect(battlefield.getamountCellState(cellState.shotEmpty)).toBe(1);
        expect(battlefield.getamountCellState(cellState.empty)).toBe((size*size)-5);
        
    })
});

describe('gameEnded', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    battlefield.setCell(4,4, cellState.ship);
    it('gameEnded correct', ()=>{
        expect(battlefield.gameEnded()).toBe(false);
        battlefield.receiveShot(4,4);
        expect(battlefield.gameEnded()).toBe(true);
    })
});

describe('cellShootable', ()=>{
    const battlefield = new Battlefield(createEmptyGrid(size));
    battlefield.setCell(6,6, cellState.ship);
    battlefield.setCell(7,7,cellState.ship);
    battlefield.receiveShot(7,7);
    battlefield.receiveShot(3,3);
    it('cellShootable correct', ()=>{
        expect(battlefield.cellShootable(6,6)).toBe(true);
        expect(battlefield.cellShootable(0,0)).toBe(true);
        expect(battlefield.cellShootable(7,7)).toBe(false);
        expect(battlefield.cellShootable(3,3)).toBe(false);
    })
})