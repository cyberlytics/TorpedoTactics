//import { PublicGameMetadata } from "../types/publicGameMetadata";
import { app } from '../app';
import { GameParticipant} from '../types/gameParticipant';
import { clientGameState } from '../types/clientGameState';
import { PublicRoomData } from '../types/publicRoomData';
import { SocketRoom } from '../types/socketRoom';
import { Room } from './room';
import { Battlefield } from '../types/battlefield';
import { socketError } from '../types/socketError';
import { endGame, addGame } from './db';
//import { read } from "fs";


export class SocketManager {
  // logging
  userConnectionLog = false;
  roomUpdateLog = true;

  io = require('socket.io')(app, {
    cors: {
      origin: '*',
    },
  });
  rooms: Room[] = [];

  initialize() {
    this.io.on(SocketRoom.connection, (socket: any) => {
      this.connectUser(socket);
    });

    return this;
  }

  connectUser(socket: any) {
    // send rooms to new client
    socket.emit(SocketRoom.lobbyRoomsChanged, this.getLobbyData());

    socket.on(SocketRoom.roomCreated, (roomId: string, userName: string) =>
      this.createRoom(roomId, userName),
    );

    socket.on(SocketRoom.roomJoined, (roomId: string, userName: string) =>
      this.joinRoom(socket, roomId, userName),
    );

    socket.on(
      SocketRoom.preparationCompleted,
      (roomId: string, userName: string, battlefield: Battlefield) =>
        this.preparationCompleted(roomId, userName, battlefield),
    );

    socket.on(SocketRoom.Shot, (roomId: string, userName: string, x: number, y: number) =>
      this.Shot(roomId, userName, x, y),
    );

    socket.on(SocketRoom.disconnected, () => this.disconnectUser(socket.id));

    socket.on(SocketRoom.clientError, (roomId: string, userName: string, Error: socketError) =>
      this.clientError(roomId, userName, Error),
    );
  }

  disconnectUser(userId: string) {
    console.log('disconnect:' + userId);
    // find joined game
    let joinedRoom = this.rooms.filter((room) =>
      room.players.some((player: GameParticipant) => player.id == userId),
    )[0];

    if (joinedRoom) {  
      //check if one player won the game 
      const wonPlayer = joinedRoom.players.find(player => player.state == clientGameState.won);
      //if not -> one player aborted the game
      if(joinedRoom.ingame && joinedRoom.players.length == 2 && wonPlayer == undefined){
        const abortedPlayer : GameParticipant = joinedRoom.players.find(player => player.id != userId)!;
        const abortingPlayer : GameParticipant = joinedRoom.players.find(player => player.id == userId)!;
        //emit the aborted message to the other player
        this.io.to(abortedPlayer.id).emit(SocketRoom.errorThrown, socketError.aborted);
        this.endGame(abortedPlayer, abortingPlayer);
      }
      //leave the room
      this.leaveRoom(joinedRoom, userId);
    }

    if (this.userConnectionLog) {
      console.log(`Client ${userId} disconnected. (${this.io.engine.clientsCount})`);
    }
  }


  createRoom(roomId: string, userName: string) {
    // create and save new room
    const newRoom: Room = new Room(
      //unique string
      roomId,
      `Room of ${userName}`,
    );
    console.log('Neuen Raum mit Id: ' + newRoom.id);
    this.rooms.push(newRoom);

    // send updated lobby rooms to clients
    this.io.emit(SocketRoom.lobbyRoomsChanged, this.getLobbyData());

    this.logRooms();
    console.log('Raum initialisieren wird abgeschlossen');
  }

  joinRoom(socket: any, roomId: string, userName: string) {
    const room = this.rooms.find((room) => room.id == roomId);
    if (!room || room.ingame) {
      return;
    }

    console.log('New Player Id: ' + socket.id);

    // add and subscribe player to room
    room.players.push(new GameParticipant(socket.id, userName));
    socket.join(room.id);

    // delete later if not needed
    /*if (room.isFull()) {
      console.log('Room is full');
      this.io.to(room.id).emit(SocketRoom.preparationStarted);
    }*/

    // update lobby rooms
    this.io.emit(SocketRoom.lobbyRoomsChanged, this.getLobbyData());
  }

  //starts the game
  preparationCompleted(roomId: string, userName: string, battlefield: Battlefield) {
    const room = this.rooms.find((room) => room.id == roomId);
    if (!room || room.ingame) {
      return;
    }

  
    //change player to ready
    const readyPlayer: GameParticipant = room.players.find(
      (player: GameParticipant) => player.name == userName,
    )!;
    //constructor, otherwise received battlefield is recognized as object
    readyPlayer.battlefield = new Battlefield(battlefield.grid);
    readyPlayer.state = clientGameState.prepared;
    console.log(readyPlayer.id + 'is ready, Battlefield' + readyPlayer.battlefield.grid);

    //start game if both players ready
    if (room.allPlayersReady() && room.isFull()) {
      room.startGame();

      //send each player the start player and the data of the enemy
      room.players.forEach((player: GameParticipant) => {
        const enemyPlayer: GameParticipant = room.players.find(
          (enemyPlayer: GameParticipant) => enemyPlayer.name != player.name,
        )!;
        this.io
          .to(player.id)
          .emit(SocketRoom.gameStarted, room.currentPlayer?.name, enemyPlayer.name);
      });
      addGame(room.players[0].name, room.players[1].name);
    }
  }
  

  //Receives a shot from a player
  Shot(roomId: string, userName: string, x: number, y: number) {
    const room = this.rooms.find((room) => room.id == roomId)!;
    if (!room || !room.ingame || room.currentPlayer?.name != userName) {
      //Error Handling
      if (room.currentPlayer?.name != userName) {
        this.io.emit(SocketRoom.errorThrown, socketError.gameSequenceError);
      }
      return;
    }

    const shooterPlayer: GameParticipant = room.players.find((player) => player.name == userName)!;
    const shotPlayer: GameParticipant = room.players.find((player) => player.name != userName)!;
    //Update battlefield
    shotPlayer.battlefield.receiveShot(x, y);

    //check if Game ended
    if (shotPlayer.battlefield.gameEnded()) {
      this.endGame(shooterPlayer, shotPlayer);
    }

    //Send shot to player who was shot
    console.log(
      'Shot to ' +
        shotPlayer.name +
        ' x:' +
        x +
        ' y:' +
        y +
        ' Battlefield: ' +
        shotPlayer.battlefield.grid,
    );
    this.io.to(shotPlayer.id).emit(SocketRoom.receivedShot, x, y);

    //Send response to player who shot
    console.log(
      'Response to ' +
        shooterPlayer.name +
        ' x:' +
        x +
        ' y:' +
        y +
        ' Cell State: ' +
        shotPlayer.battlefield.getCell(x, y),
    );
    this.io
      .to(shooterPlayer.id)
      .emit(SocketRoom.responsetoShot, x, y, shotPlayer.battlefield.getCell(x, y));
    
    //shotPlayer's turn
    room.currentPlayer = shotPlayer;
  }

  leaveRoom(room: Room, userId: string) {
    // leave joined games
    room.players = room.players.filter((player: GameParticipant) => player.id != userId);

    // close room if empty
    if (room.players.length == 0) {
      this.rooms = this.rooms.filter((room) => room.id != room.id);
    }

    // update lobby data
    this.io.emit(SocketRoom.lobbyRoomsChanged, this.getLobbyData());
  }

  clientError(roomId: string, userName: string, Error: socketError) {
    const room = this.rooms.find((room) => room.id == roomId);
    if(!room) return;
    switch (Error) {
      case socketError.gameSequenceError:
        console.error('Game Sequence Error from ' + userName + ', passed to both clients');
        this.io.to(roomId).emit(SocketRoom.errorThrown, socketError.gameSequenceError);
        break;
    }
  }

  endGame(winner : GameParticipant, looser : GameParticipant){
    console.log(looser.name + ' lost');
    console.log(winner.name + ' won');
    looser.state = clientGameState.lost;
    winner.state = clientGameState.won;
    endGame(winner.name, looser.name,winner.name, winner.battlefield.getamountCellState(cellState.shotShip), winner.battlefield.getamountCellState(cellState.shotShip), looser.name, looser.battlefield.getamountCellState(cellState.shotShip),looser.battlefield.getamountCellState(cellState.shotShip),winner.battlefield.getamountCellState(cellState.shotEmpty), looser.battlefield.getamountCellState(cellState.shotEmpty) );
    
    //save gamedata here to database
    //you get hits and misses with player.battlefield.getAmountCellState(cellState.shotShip);
  }

  getLobbyData() {
    return this.rooms
      .filter((room) => !room.isFull())
      .filter((room) => !room.ingame)
      .map((room) => new PublicRoomData(room.id, room.name));
  }


  logRooms() {
    if (this.roomUpdateLog) {
      console.log(`rooms: open (${this.getLobbyData().length}) / all (${this.rooms.length})`);
    }
  }
}
