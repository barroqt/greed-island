import {
    useAccount,
    useDisconnect,
} from 'wagmi'
import WalletOptions from './WalletOptions';

type Props = {
    onDisconnect: Function;
};

export const ConnectWallet = (props: Props) => {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <>
                <div
                    className="btnBox nes-btn is-primary"
                    style={{
                        cursor: 'pointer',
                        padding: '5px',
                        fontSize: '10px',
                        marginTop: '7px',
                    }}
                    onClick={() => {
                        disconnect();
                        props.onDisconnect();
                    }}
                >Disconnect</div>
            </>
        );
    }

    return (
        <WalletOptions />
    );
};