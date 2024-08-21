import React from 'react';
import { AimOutlined } from '@ant-design/icons';

const styles = {
  tiled: {
    width: '100%',
    height: '100%',
    background: 'blue',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  tiledInactif: {
    width: '100%',
    height: '100%',
    background: 'grey',
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
  contentChild: {
    maxHeight: "calc(100% - 120px)",
    overflowY: 'scroll'
  } as React.CSSProperties,
  backBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    background: '#373737',
    textAlign: 'center',
    padding: '5px',
  } as React.CSSProperties,
  fullWidth: {
    width: '100%',
  },
};

type PhoneAimType = {
  onCancel: Function;
  onConfirm?: Function;
};
type PhoneAimTiledType = {
  onClick?: Function;
  actif: boolean;
};

function PhoneAim(props: PhoneAimType) {
  return (
    <div style={styles.content}>
      <p style={styles.backBtn} onClick={() => {
        props.onCancel();
      }}>Back</p>
    </div>
  )
}

export const PhoneAimTiled = (props: PhoneAimTiledType) => {
  return (
    <div onClick={props.actif ? () => props.onClick && props.onClick() : () => { }} style={props.actif ? styles.tiled : styles.tiledInactif}>
      <AimOutlined style={{ fontSize: '35px', marginBottom: '2px' }} />
      <p>Tools</p>
    </div>
  )
}

export default PhoneAim;