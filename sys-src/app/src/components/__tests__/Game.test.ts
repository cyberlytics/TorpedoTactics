import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Game from '../game/Game.vue'
import { Battlefield, cellState } from '@/types/battlefield'


describe('Game', () => {
    it('loads props correctly', () => {
        const userName = 'foo';
        const enemyName = 'bar';
        const myTurn = false;
        const myBattlefield = new Battlefield([[cellState.empty]]);
        const enemyBattlefield = new Battlefield([[cellState.empty], [cellState.empty]]);
        const state = 0;

        const gameComponent = mount(Game, { props: { 
            userName: userName,
            enemyName: enemyName,
            myTurn: myTurn,
            myBattlefield: myBattlefield,
            enemyBattlefield: enemyBattlefield,
            state: state
        }});

        expect(gameComponent.props().userName).toBe(userName);
        expect(gameComponent.props().enemyName).toBe(enemyName);
        expect(gameComponent.props().myTurn).toBe(myTurn);
        expect(gameComponent.props().myBattlefield).toEqual(myBattlefield);
        expect(gameComponent.props().enemyBattlefield).toEqual(enemyBattlefield);
        expect(gameComponent.props().state).toBe(state);
    })
})