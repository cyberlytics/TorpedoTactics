import { Player } from "src/types/player";
import { getRandomElementFromArray } from "./helperFunctions";

export class Room {
    // room
    id: string;
    name: string;
    ingame: boolean = false;
    players: Player[];
    maxPlayers: number;

    // game
    currentPlayer: Player | null;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.players = [];
        this.maxPlayers = 2;
        
        this.currentPlayer = null;
    }

    playerCount() {
        return this.players.length;
    }

    isFull() {
        return (this.playerCount() >= this.maxPlayers);
    }

    startGame() {
        this.ingame = true;
        
       // public game metadata
        this.currentPlayer = getRandomElementFromArray(this.players);

        console.log(`${this.name}: game started`);
    }
}