import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'
import { GameContextProvider } from "./store";

import './PhaserGame'

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

import Providers from './providers';

const client = new Ably.Realtime({ key: 'dk1dcw.oz8yiw:7esbnzVPt9-gVsuAXtiHMdMT4hbYOHXQm_N19aQyqM8', clientId: '' });
//const realtime = new Ably.Realtime({ authUrl: '/auth' });

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode >
    <AblyProvider client={client} ablyId={'dk1dcw'}>
      <ChannelProvider channelName="players-move" ablyId="dk1dcw">
        <ChannelProvider channelName="players-interactions" ablyId="dk1dcw">
          <GameContextProvider>
            <Providers>
              <App />
            </Providers>
          </GameContextProvider>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  </React.StrictMode >
);


