export enum SocketRoom {
    connection = 'connection',
    disconnected = 'disconnect',

    roomCreated = 'roomCreated',
    roomJoined = 'roomJoined',
    gameStarted = "gameStarted",

    lobbyRoomsChanged = 'lobbyRoomsChanged',
    
    gamedataPublished = 'gamedataPublished',
}