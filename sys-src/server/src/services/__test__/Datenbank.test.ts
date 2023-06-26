import { saveStartedGame } from '../db';
import { saveEndedGame } from '../db';
import { playerids } from '../db';


// model
import {User} from '../../models/user';
import { Player } from '../../models/player';
import { Game } from '../../models/game';

describe('saveStartedGame', () => {
  // Fehler beim Abrufen eines Spielers
    it('should return early if player retrieval fails', async () => {
    const mockGetUserByName  = jest.fn().mockResolvedValue(null);
    jest.spyOn(User, 'getUserByName').mockImplementation(mockGetUserByName);

    const mockPlayerbyUserId  = jest.fn().mockResolvedValue(null);
    jest.spyOn(Player, 'getPlayerbyUserId').mockImplementation(mockPlayerbyUserId);
    

    //mocks für player1 und player2
    const mockAddGame = jest.fn().mockResolvedValue(null);
    jest.spyOn(Game, 'addGame').mockImplementation(mockAddGame);

    await saveStartedGame('username1', 'username2');    
    // Überprüfen, ob die erwarteten Funktionen aufgerufen wurden
    expect(mockGetUserByName).toHaveBeenCalledTimes(2);
    expect(mockPlayerbyUserId).toHaveBeenCalledTimes(0);
    expect(mockAddGame).toHaveBeenCalledTimes(0);    
  });

  // Fehler beim Abrufen eines Spielers
it('should return early if player retrieval fails', async () => {
    const mockGetUserByName = jest.fn().mockResolvedValue({ id: 'user1Id' });
    jest.spyOn(User, 'getUserByName').mockImplementation(mockGetUserByName);

    const mockPlayerbyUserId = jest.fn().mockResolvedValue(null);
    jest.spyOn(Player, 'getPlayerbyUserId').mockImplementation(mockPlayerbyUserId);

    const mockAddGame = jest.fn().mockResolvedValue(null);
    jest.spyOn(Game, 'addGame').mockImplementation(mockAddGame);

    await saveStartedGame('username1', 'username2');

    expect(mockGetUserByName).toHaveBeenCalledTimes(2);
    expect(mockPlayerbyUserId).toHaveBeenCalledTimes(2);
    expect(mockAddGame).toHaveBeenCalledTimes(0);
  });


  it('should return early if player retrieval fails', async () => {
    const mockGetUserByName = jest.fn().mockResolvedValue({ id: 'user1Id' });
    jest.spyOn(User, 'getUserByName').mockImplementation(mockGetUserByName);

    const mockPlayerbyUserId = jest.fn().mockResolvedValue({playerid : 'playerid1'});
    jest.spyOn(Player, 'getPlayerbyUserId').mockImplementation(mockPlayerbyUserId);

    const mockAddGame = jest.fn().mockResolvedValue(null);
    jest.spyOn(Game, 'addGame').mockImplementation(mockAddGame);

    await saveStartedGame('username1', 'username2');

    expect(mockGetUserByName).toHaveBeenCalledTimes(2);
    expect(mockPlayerbyUserId).toHaveBeenCalledTimes(2);
    expect(mockAddGame).toHaveBeenCalledTimes(1);
  });
});


describe('saveEndedGame', () => {  

    it('test', async () => {
        playerids.clear();

        const mockbyPlayerid = jest.fn().mockResolvedValue(null);
        jest.spyOn(playerids, 'get').mockImplementation(mockbyPlayerid);

        const mockGetUserByName  = jest.fn().mockResolvedValue(null);
        jest.spyOn(User, 'getUserByName').mockImplementation(mockGetUserByName);
    
        const mockPlayerbyUserId  = jest.fn().mockResolvedValue(null);
        jest.spyOn(Player, 'getPlayerbyUserId').mockImplementation(mockPlayerbyUserId);
        
        const mockGetGamebyPlayers  = jest.fn().mockResolvedValue(null);
        jest.spyOn(Game, 'getGamebyPlayers').mockImplementation(mockGetGamebyPlayers);
    
        const mockEndGame = jest.fn().mockResolvedValue(null);
        jest.spyOn(Game, 'addGame').mockImplementation(mockEndGame);
    
        await saveEndedGame('username1', 'username2', 'winnername', 1, 2, 3, 4, false);    
        // Überprüfen, ob die erwarteten Funktionen aufgerufen wurden
        expect(mockGetUserByName).toHaveBeenCalledTimes(0);
        expect(mockPlayerbyUserId).toHaveBeenCalledTimes(0);
        expect(mockGetGamebyPlayers).toHaveBeenCalledTimes(0);
        expect(mockEndGame).toHaveBeenCalledTimes(0);
    });
});


    it('should handle a player not found', async () => {
      const mockGetGamebyPlayers = jest.fn().mockResolvedValue({ id: 'gameId', ended: 123 });
      jest.spyOn(Game, 'getGamebyPlayers').mockImplementation(mockGetGamebyPlayers);
  
      const mockEndGame = jest.fn().mockResolvedValue(null);
      jest.spyOn(Game.prototype, 'endGame').mockImplementation(mockEndGame);
  
      const mockUpdatePlayer = jest.fn().mockResolvedValue(null);
      jest.spyOn(Player, 'getPlayer').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(Player.prototype, 'updateStats').mockImplementation(mockUpdatePlayer);
  
      await saveEndedGame('username1', 'username2', 'username1', 10, 5, 2, 3,false); 
    });



