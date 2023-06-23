import { saveStartedGame } from '../db';

// model
import {User} from '../../models/user';
import { Player } from '../../models/player';


// mocks    

// Create a mock function for mongoose.connect
// mongoose.connect = jest.fn()
// jest.mock('../../model/User', () => ({
//     getUserByName: jest.fn(),
//     getgetPlayerbyUserId: jest.fn(),
//     findOne: jest.fn(),
//     create: jest.fn()
// }))

describe('testTest', () => {
    it('test', async () => {
        const mockGetUserByName  = jest.fn().mockResolvedValue(null);
 jest.spyOn(User, 'getUserByName').mockImplementation(mockGetUserByName);

 const mockPlayerbyUserId  = jest.fn().mockResolvedValue(null);
 jest.spyOn(Player, 'getPlayerbyUserId').mockImplementation(mockPlayerbyUserId);

 await saveStartedGame('username1', 'username2');
 
 
        
    // Überprüfen, ob die erwarteten Funktionen aufgerufen wurden
    expect(mockGetUserByName).toHaveBeenCalledTimes(2);
    expect(mockPlayerbyUserId).toHaveBeenCalledTimes(0);
    // Aufruf der Funktion mit den erwarteten Parametern
 })

 

})

