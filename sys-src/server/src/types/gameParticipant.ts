import { Battlefield, cellState } from './battlefield';
import { clientGameState } from './clientGameState';


export class GameParticipant {
  id: string;
  name: string;
  state: clientGameState;
  battlefield: Battlefield;

  //default value for battlefield, with a fixed size it could be bigger
  constructor(
    id: string,
    name: string,
    battlefield: Battlefield = new Battlefield([[cellState.empty]]),
  ) {
    this.id = id;
    this.name = name;
    this.battlefield = battlefield;
    this.state = clientGameState.preparation;
  }
}
