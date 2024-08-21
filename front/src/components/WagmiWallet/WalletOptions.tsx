import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export default function WalletOptions() {
    const { connectors, connect } = useConnect();

    return connectors && connectors.length > 0 ? connectors.filter(connector => connector.id.indexOf('metamask') !== -1).slice(0, 1).map((connector) => (
        <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
        />
    ))[0] : <p className="btnBox nes-btn is-primary" style={{
        background: 'gray',
        padding: '10px',
        borderRadius: '5px',
    }}>Install Metamask to continue</p>
}

function WalletOption({
    connector,
    onClick,
}: {
    connector: Connector
    onClick: () => void
}) {
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        ; (async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector]);

    return (
        <button
            className="btnBox nes-btn is-primary"
            style={{
                cursor: 'pointer',
                padding: '5px'
            }}
            disabled={!ready} onClick={onClick}>
            Connect with {connector.name}<br />
            to join the game.
        </button>
    )
}