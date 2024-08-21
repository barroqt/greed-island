import React from 'react';

import "antd/dist/antd.css";
import "nes.css/css/nes.min.css";

import { CoffeeOutlined, LoadingOutlined } from '@ant-design/icons';
import tokensImg from '../utils/tokens';

const styles = {
    tiled: {
        width: '100%',
        height: '100%',
        background: 'blue',
        display: 'flex',
        flexDirection: 'column',
    } as React.CSSProperties,
    content: {
        position: 'relative',
        display: "flex",
        flexDirection: "column",
        height: '100%',
        overflowY: 'auto',
        justifyContent: "center",
        fontFamily: "Roboto, sans-serif",
        color: "white",
    } as React.CSSProperties,
    backBtn: {
        background: '#373737',
        textAlign: 'center',
        padding: '5px',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    } as React.CSSProperties,
    iconStyle: {
        marginRight: '4px',
        position: 'relative',
        bottom: '5px',
    } as React.CSSProperties,
};

type PhoneNFTType = {
    isLoading: boolean;
    nfts: any;
    owner: `0x${string}`;
    launchMint: Function;
    onCancel: Function;
};
type PhoneNFTTiledType = {
    onClick: Function;
};

function PhoneNFT(props: PhoneNFTType) {
    return (
        <div style={{ position: 'relative', maxHeight: '97%', overflowY: 'auto', }}>
            <div style={styles.content}>
                <p
                    onClick={() => !props.isLoading && props.launchMint(props.owner)}
                    className="nes-btn is-primary"
                    style={{ padding: '0 10px', margin: '15px 0' }}>
                    {!props.isLoading && <span style={{ color: 'white' }}>Mint a new NFT</span>}
                    {props.isLoading && <LoadingOutlined style={{ position: 'relative', bottom: '3px' }} />}
                </p>

                <p className="nes-badge" style={{ margin: '10px auto' }}>
                    <span className="is-warning" style={{ color: '#024a79' }}>My NFTs</span>
                </p>
                {!props.nfts.length && <p style={{ margin: 'auto', display: 'block', marginBottom: '15px' }}>Nothing to display</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexDirection: 'row', paddingBottom: '40px' }}>
                    {props.nfts.length > 0 &&
                        props.nfts.map((e: { tokenID: string }, index: number) => <div style={{ textAlign: 'center' }} key={index}>
                            <div style={{
                                background: '#ffcb94',
                                borderRadius: '50%',
                                maxWidth: '70px',
                                padding: '11px',
                                margin: '5px',
                            }} >
                                <img
                                    style={{ maxWidth: '45px' }}
                                    src={tokensImg[parseInt(e.tokenID.slice(-1)) - 1]}
                                    alt={e.tokenID}
                                />
                            </div>
                            <h5 style={{ color: 'white' }}>{e.tokenID}</h5>
                        </div>
                        )
                    }

                </div>
                <p style={{ ...styles.backBtn, bottom: '-15px' }} onClick={() => { props.onCancel(); }}>Back</p>
            </div>
        </div>
    )
}

export const PhoneNFTTiled = (props: PhoneNFTTiledType) => {
    return (
        <div onClick={() => props.onClick()} style={styles.tiled}>
            <CoffeeOutlined style={{ fontSize: '35px', marginBottom: '2px' }} />
            <p>NFTs</p>
        </div>
    )
}

export default PhoneNFT;