import { GameParticipant} from '../types/gameParticipant';
import { clientGameState } from '../types/clientGameState';
import { getRandomElementFromArray } from './helperFunctions';

export class Room {
  // room
  id: string;
  name: string;
  ingame: boolean = false;
  players: GameParticipant[];
  maxPlayers: number;

  // game
  currentPlayer: GameParticipant | null;

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
    return this.playerCount() >= this.maxPlayers;
  }

  allPlayersReady(): boolean {
    return this.players.every((player) => player.state == clientGameState.prepared);
  }

  startGame() {
    this.ingame = true;

    this.players.forEach((player) => {
      player.state = clientGameState.ingame;
    });

    // public game metadata
    this.currentPlayer = getRandomElementFromArray(this.players);

    console.log(`${this.name}: game started`);
  }
}
