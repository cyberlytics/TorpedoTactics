import { GameState } from '../../types/gameParticipant';
import { SocketManager } from '../socketManager';
import { Battlefield, cellState } from '../../types/battlefield';

let socketManager: SocketManager;

beforeEach(() => {
  socketManager = new SocketManager().initialize();
});

describe('initialize', () => {
  it('does not throw exception', () => {
    expect(() => socketManager.initialize()).not.toThrow();
  });
});

describe('connectUser', () => {
  it('does not throw exception', () => {
    socketManager.userConnectionLog = true;
    let socket = {
      id: '1',
      emit: () => {},
      on: () => {},
    };
    expect(() => socketManager.connectUser(socket)).not.toThrow();
  });
});

describe('createRoom', () => {
  it('creates room correctly', () => {
    let roomId = '1234';
    let userName = 'foo';

    socketManager.createRoom(roomId, userName);

    expect(socketManager.rooms.length).toBe(1);

    let room = socketManager.rooms[0];
    expect(room.id).toBe(roomId);
    expect(room.name).toBe(`Room of ${userName}`);
  });
});

describe('joinRoom', () => {
  it('adds user to room correctly', () => {
    let roomId = 'roomId';
    let roomCreaterName = 'creatorName';

    let joinUserId = 'joinId';
    let joinUserName = 'joinName';

    socketManager.createRoom(roomId, roomCreaterName);
    socketManager.joinRoom({ id: joinUserId, join: () => {} }, roomId, joinUserName);

    let room = socketManager.rooms[0];
    expect(room.playerCount()).toBe(1);
    expect(room.players[0].id).toBe(joinUserId);
    expect(room.players[0].name).toBe(joinUserName);
  });
});

describe('leaveRoom', () => {
  it('removes user from joined room', () => {
    let userId = 'joinId';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: userId, join: () => {} }, '1', 'joinName');

    let room = socketManager.rooms[0];
    expect(room.playerCount()).toBe(1);

    socketManager.leaveRoom(room, userId);
    expect(room.playerCount()).toBe(0);
  });
});

describe('leaveRoom', () => {
  it('closes room if empty', () => {
    let userId = 'joinId';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: userId, join: () => {} }, '1', 'joinName');
    socketManager.leaveRoom(socketManager.rooms[0], userId);

    expect(socketManager.rooms.length).toBe(0);
  });
});

describe('getLobbyData', () => {
  it('only gets correct games', () => {
    // full room
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: 'join1', join: () => {} }, '1', 'join1');
    socketManager.joinRoom({ id: 'join2', join: () => {} }, '1', 'join2');

    // empty room
    socketManager.createRoom('2', '2');

    let lobbyData = socketManager.getLobbyData();
    expect(lobbyData.length).toBe(1);
    expect(lobbyData[0].id).toBe('2');
  });
});

describe('logRooms', () => {
  it('does not throw exception', () => {
    socketManager.roomUpdateLog = true;
    expect(() => socketManager.logRooms()).not.toThrow();
  });
});

describe('preparationCompleted', () => {
  it('sets player ready', () => {
    let userId1 = 'joinId1';
    let userId2 = 'joinId2';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: userId1, join: () => {} }, '1', 'joinName1');
    socketManager.joinRoom({ id: userId2, join: () => {} }, '1', 'joinName2');

    let grid: cellState[][] = Array.from({ length: 1 }, () =>
      Array.from({ length: 1 }, () => cellState.empty),
    );
    let battlefield = new Battlefield(grid);

    socketManager.preparationCompleted('1', 'joinName1', battlefield);
    let readyPlayer = socketManager.rooms[0].players.find((player) => player.name == 'joinName1');
    expect(readyPlayer?.battlefield).toStrictEqual(battlefield);
    expect(readyPlayer?.state).toBe(GameState.prepared);
  });
});

describe('preparationCompleted', () => {
  it('starts game if room is full', () => {
    let userId1 = 'joinId1';
    let userId2 = 'joinId2';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: userId1, join: () => {} }, '1', 'joinName1');
    socketManager.joinRoom({ id: userId2, join: () => {} }, '1', 'joinName2');

    let grid: cellState[][] = Array.from({ length: 1 }, () =>
      Array.from({ length: 1 }, () => cellState.empty),
    );
    let battlefield = new Battlefield(grid);

    socketManager.preparationCompleted('1', 'joinName1', battlefield);
    socketManager.preparationCompleted('1', 'joinName2', battlefield);
    expect(socketManager.rooms[0].ingame).toBe(true);
    expect(socketManager.rooms[0].players[0].state).toBe(GameState.ingame);
    expect(socketManager.rooms[0].players[1].state).toBe(GameState.ingame);
    expect(socketManager.rooms[0].currentPlayer).toBeDefined();
  });
});

describe('shot', () => {
  it('Shot is correct handled', () => {
    let userName1 = 'joinName1';
    let userName2 = 'joinName2';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: 'joinId1', join: () => {} }, '1', userName1);
    socketManager.joinRoom({ id: 'joinId2', join: () => {} }, '1', userName2);

    let grid1: cellState[][] = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => cellState.empty),
    );
    let grid2: cellState[][] = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => cellState.empty),
    );
    let battlefield1 = new Battlefield(grid1);
    let battlefield2 = new Battlefield(grid2);
    battlefield1.setCell(0, 0, cellState.ship);
    battlefield1.setCell(0, 1, cellState.ship);
    battlefield2.setCell(0, 0, cellState.ship);
    battlefield2.setCell(0, 1, cellState.ship);

    socketManager.preparationCompleted('1', userName1, battlefield1);
    socketManager.preparationCompleted('1', userName2, battlefield2);

    let player1 = socketManager.rooms[0].players.find((player) => player.name == userName1);
    let player2 = socketManager.rooms[0].players.find((player) => player.name == userName2);
    socketManager.rooms[0].currentPlayer = player1!;

    socketManager.Shot('1', userName1, 0, 0);
    expect(player2?.battlefield.getCell(0, 0)).toBe(cellState.shotShip);
    expect(player1?.battlefield.getCell(0, 0)).toBe(cellState.ship);
    expect(socketManager.rooms[0].currentPlayer).toStrictEqual(player2);

    socketManager.Shot('1', userName2, 1, 0);
    expect(player1?.battlefield.getCell(1, 0)).toBe(cellState.shotEmpty);
    expect(player2?.battlefield.getCell(1, 0)).toBe(cellState.empty);
    expect(socketManager.rooms[0].currentPlayer).toStrictEqual(player1);

    expect(player1?.state).toBe(GameState.ingame);
    expect(player2?.state).toBe(GameState.ingame);
  });
});

describe('shot', () => {
  it('Win and Lost ist correct handled', () => {
    let userName1 = 'joinName1';
    let userName2 = 'joinName2';
    socketManager.createRoom('1', '1');
    socketManager.joinRoom({ id: 'joinId1', join: () => {} }, '1', userName1);
    socketManager.joinRoom({ id: 'joinId2', join: () => {} }, '1', userName2);

    let grid1: cellState[][] = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => cellState.empty),
    );
    let grid2: cellState[][] = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => cellState.empty),
    );
    let battlefield1 = new Battlefield(grid1);
    let battlefield2 = new Battlefield(grid2);
    battlefield1.setCell(0, 0, cellState.ship);
    battlefield2.setCell(0, 0, cellState.ship);

    socketManager.preparationCompleted('1', userName1, battlefield1);
    socketManager.preparationCompleted('1', userName2, battlefield2);

    let player1 = socketManager.rooms[0].players.find((player) => player.name == userName1);
    let player2 = socketManager.rooms[0].players.find((player) => player.name == userName2);
    socketManager.rooms[0].currentPlayer = player1!;

    socketManager.Shot('1', userName1, 0, 0);
    expect(player2?.state).toBe(GameState.lost);
    expect(player1?.state).toBe(GameState.won);
  });
});
