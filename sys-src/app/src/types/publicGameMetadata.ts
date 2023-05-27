import {Battlefield} from '../types/battlefield';

export class PublicGameMetadata {
    players: string[];
    currentPlayerName: string | undefined;
    battlefields: Battlefield[];

    constructor(players: string[], currentPlayerName: string | undefined, battlefields : Battlefield[]) {
        this.players = players;
        this.currentPlayerName = currentPlayerName;
        this.battlefields = battlefields;
    }
}