export enum SocketRoom {
    connection = 'connection',
    disconnected = 'disconnect',

    roomCreated = 'roomCreated',
    roomJoined = 'roomJoined',
    preparationStarted = 'preparationStarted',
    preparationCompleted = "preparationCompleted",
    gameStarted = 'gameStarted',

    Shot = "Shot",
    responsetoShot = "responsetoShot",
    receivedShot = "receivedShot",

    lobbyRoomsChanged = 'lobbyRoomsChanged',
    
   
}