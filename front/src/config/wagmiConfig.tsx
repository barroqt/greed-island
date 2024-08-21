// @ts-nocheck
import {
  createConfig,
  cookieStorage,
  createStorage
} from 'wagmi';
import { defineChain, createPublicClient, http, createWalletClient, custom } from 'viem';

export const scrollSepolia = defineChain({
  id: 534351,
  name: 'Scroll Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io'],
      //webSocket: ['wss://ws.sepolia-rpc.scroll.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-blockscout.scroll.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
})

export const config = createConfig({
  chains: [scrollSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [scrollSepolia.id]: http(),
  },
})

export const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: scrollSepolia,
  transport: window.ethereum ? custom(window.ethereum) : http()
});