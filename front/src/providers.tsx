import { WagmiProvider, cookieToInitialState } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config as wagmiConfig } from "./config/wagmiConfig";
import { Web3ContextProvider } from "./store/Web3Context";
import { WebSocketProvider } from "./store/WebSocketContext";
import { Web2ContextProvider } from "./store/Web2Context";

import { getCookie } from "./utils/index";

const queryClient = new QueryClient();

type Props = {
    children: React.ReactNode;
};

export default function Providers({ children }: Props) {
    const cookie = getCookie('wagmi.store');
    // console.log({ cookie });

    const initialState = cookieToInitialState(wagmiConfig, cookie);

    return (
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <Web3ContextProvider>
                    <WebSocketProvider>
                        <Web2ContextProvider>
                            {children}
                        </Web2ContextProvider>
                    </WebSocketProvider>
                </Web3ContextProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}