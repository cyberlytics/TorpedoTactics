export enum SocketRoom {
    connection = 'connection',
    disconnected = 'disconnect',

    roomCreated = 'roomCreated',
    roomJoined = 'roomJoined',
    preparationStarted = 'preparationStarted',
    preparationCompleted = "preparationCompleted",
    gameStarted = "gameStarted",

    lobbyRoomsChanged = 'lobbyRoomsChanged',
    
    gamedataPublished = 'gamedataPublished',
}