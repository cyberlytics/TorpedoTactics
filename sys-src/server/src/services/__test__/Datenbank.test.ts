import { saveStartedGame } from '../db';
import { saveEndedGame } from '../db';

// model
import {User} from '../../models/user';
import { Player } from '../../models/player';
import { Game } from '../../models/game';

describe('saveStartedGame', () => {
    it('test', async () => {
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
 })
})

describe('saveEndedGame', () => {  
    it('test', async () => {
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
    })
})

