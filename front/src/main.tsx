import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Providers from './providers.tsx';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

// load game to container
import './PhaserGame'

const client = new Ably.Realtime({ key: '' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AblyProvider client={client} ablyId={'dk1dcw'}>
      <ChannelProvider channelName="players-move" ablyId="dk1dcw">
        <ChannelProvider channelName="players-interactions" ablyId="dk1dcw">
          <Providers>
            <App />
          </Providers>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  </StrictMode>,
)
