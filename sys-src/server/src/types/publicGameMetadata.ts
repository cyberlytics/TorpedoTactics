export class PublicGameMetadata {
    players: string[];
    currentPlayerName: string | undefined;

    constructor(players: string[], currentPlayerName: string | undefined) {
        this.players = players;
        this.currentPlayerName = currentPlayerName;
    }
}