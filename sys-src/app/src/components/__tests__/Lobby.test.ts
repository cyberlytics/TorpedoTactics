import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Lobby from '../game/Lobby.vue'
import { PublicRoomData } from '@/types/publicRoomData'


describe('Lobby', () => {
    it('loads props correctly', () => {
        const userName = 'foo';
        const rooms = [ new PublicRoomData(userName, 'bar') ];

        const lobbyComponent = mount(Lobby, { props: { 
            userName: userName,
            rooms: rooms
        }});

        expect(lobbyComponent.props().userName).toBe(userName);
        expect(lobbyComponent.props().rooms).toEqual(rooms);
    })
})