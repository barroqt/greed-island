import React, { useEffect, useState } from "react";
import { useChannel } from 'ably/react';
import { PlayerPos, Multiplayers, WebSocketContext } from './types';

import phaserGame from '../PhaserGame';

const WebSocket = React.createContext<WebSocketContext>({
    playerName: '',
    setPlayerName: () => { },
    multiplayers: {},
    sendMove: (playerName: string, playerPos: PlayerPos) => { },
});

type Props = {
    children: React.ReactNode;
};

export const WebSocketProvider = (props: Props) => {
    const [playerName, setPlayerName] = useState('');
    const [multiplayers, setMultiplayers] = useState<Multiplayers>({});

    // useEffect(() => {
    //     console.log(multiplayers);
    // }, [multiplayers]);

    const channelPlayersMove = useChannel({ channelName: 'players-move', ablyId: 'dk1dcw' }, (message) => {
        console.log('data receieved', message, playerName);
        const data = JSON.parse(message.data);
        const updatedMultiplayers = multiplayers;

        // if message is from another player
        if (playerName
            && message.name
            && data
            && data.map
            && message.name !== playerName) {
            const newMap = data.map;
            if (multiplayers[message.name]
                && multiplayers[message.name].map != newMap) {
                const previousMap = multiplayers[message.name].map;
                phaserGame.scene.keys[previousMap].events.emit('destroyplayer', message.name);
            }

            if (phaserGame.scene.keys[newMap]) {
                console.log('move another player');
                phaserGame.scene.keys[newMap].events.emit('moveanotherplayer', { name: message.name, pos: data });
            }
            updatedMultiplayers[message.name] = data;
            setMultiplayers(multiplayers => ({ ...multiplayers, ...updatedMultiplayers }));
        }
    });

    const sendMove = (playerName: string, playerPos: PlayerPos) => {
        // console.log('sendMove');
        channelPlayersMove.channel.publish(playerName, JSON.stringify(playerPos));
    };

    return (
        <WebSocket.Provider
            value={{
                playerName,
                setPlayerName,
                multiplayers,
                sendMove,
            }}
        >
            {props.children}
        </WebSocket.Provider>
    );
};

export default WebSocket;