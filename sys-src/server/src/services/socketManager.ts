import { PublicGameMetadata } from "../types/publicGameMetadata";
import { app } from "../app";
import { GameParticipant } from "../types/gameParticipant";
import { PublicRoomData } from "../types/publicRoomData";
import { SocketRoom } from "../types/socketRoom";
import { Room } from "./room";
import { Battlefield } from "src/types/battlefield";

export class SocketManager {
  // logging
  userConnectionLog = false;
  roomUpdateLog = true;
  
  io = require('socket.io')(app, {
    cors: {
      origin: "*"
    }
  });
  rooms: Room[] = [];

  initialize() {
    this.io.on(
      SocketRoom.connection, (socket: any) =>
      this.connectUser(socket)
    );

    return this;
  }

  connectUser(socket: any) {
    // send rooms to new client
    socket.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData());
      
    socket.on(
      SocketRoom.roomCreated, (userName: string) =>
      this.createRoom(socket.id, userName)
    );

    socket.on(
      SocketRoom.roomJoined, (roomId: string, userName: string) =>
      this.joinRoom(socket, roomId, userName)
    );

    socket.on(
      SocketRoom.preparationCompleted, (roomId:string,userName: string, battlefield : Battlefield) =>
      this.preparationCompleted(roomId,userName, battlefield)
    )

    socket.on(
      SocketRoom.disconnected, () =>
      this.disconnectUser(socket.id)
    );

    if (this.userConnectionLog) {
      console.log(`Client ${socket.id} connected. (${this.io.engine.clientsCount})`);
    }
  }
 
  disconnectUser(userId: string) {
    // find joined game
    let joinedRoom = this.rooms.filter(room => room.players.some((player: GameParticipant) => player.id == userId))[0];
    if (joinedRoom) {
      this.leaveRoom(joinedRoom, userId);
    }


    if (this.userConnectionLog) {
      console.log(`Client ${userId} disconnected. (${this.io.engine.clientsCount})`);
    }
  }
  
  createRoom(userId: string, userName: string) {
    // create and save new room
    const newRoom: Room = new Room(
      userId,
      `Room of ${userName}`
    );
    console.log("Neuen Raum mit Id: "+newRoom.id);

    this.rooms.push(newRoom);
    
    // send updated lobby rooms to clients
    this.io.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData()
    );

    this.logRooms();
  }

  joinRoom(socket: any, roomId: string, userName: string) {
    const room = this.rooms.find((room) => room.id == roomId);
        if (!room
          || room.ingame) {
          return;
        }

        console.log("New Player Id: "+socket.id);

        // add and subscribe player to room
        room.players.push(new GameParticipant(socket.id, userName));
        socket.join(room.id);
  
        // start game if full
        if (room.isFull()) {
          console.log("Room is full")
          this.io.to(room.id).emit(SocketRoom.preparationStarted);
        }

        // update lobby rooms
        this.io.emit(
          SocketRoom.lobbyRoomsChanged,
          this.getLobbyData()
        );
  
        this.updateGamedata(room);
  }

  preparationCompleted(roomId:string,userName: string, battlefield : Battlefield){
    const room = this.rooms.find((room) => room.id == roomId);
        if (!room
          || room.ingame) {
          return;
        }
    
    //change player to ready
    const readyPlayer: GameParticipant = room.players.find((player: GameParticipant) => player.name == userName)!;
    readyPlayer.battlefield = battlefield;
    readyPlayer.ready = true;
    console.log(readyPlayer.id + "is ready");

    //start game if both players ready
    if(room.allPlayersReady()){
      room.startGame();
      this.io.to(room.id).emit(SocketRoom.gameStarted);
    }

    //update lobby rooms (??)

  }

  leaveRoom(room: Room, userId: string) {
    // leave joined games
    room.players = room.players.filter((player: GameParticipant) => player.id != userId);

    // close room if empty
    if (room.players.length == 0) {
      this.rooms = this.rooms.filter(room => room.id != room.id);
    }
    // update room members
    else {
      this.updateGamedata(room);
    }

    // update lobby data
    this.io.emit(
      SocketRoom.lobbyRoomsChanged,
      this.getLobbyData()
    ); 
  }

  updateGamedata(room: Room) {
    // get new game data
    const gameMetadata = new PublicGameMetadata(
      room.players.map((player) => player.name),
      room.currentPlayer?.name,
      room.players.map((player)=>player.battlefield)
    )

    // update room members with new game data
    this.io.to(room.id).emit(
      SocketRoom.gamedataPublished,
      gameMetadata
    );
  }

  getLobbyData() {
    return this.rooms
      .filter((room) => !room.isFull())
      .filter((room) => !room.ingame)
      .map((room) => new PublicRoomData(room.id, room.name))
  }

  logRooms() {
    if (this.roomUpdateLog) {
      console.log(`rooms: open (${(this.getLobbyData()).length}) / all (${this.rooms.length})`);
    }
}
}