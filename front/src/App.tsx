import { useState, useEffect, useContext } from 'react';
import './App.css'

import config from './config';
import { scrollSepolia } from "./config/wagmiConfig";

import GameContext from "./store";
import {
  Objects,
  PlayerPos,
  Quests,
  GoalLine,
} from "./store/types";
import Web3Context from "./store/Web3Context";
import Web2Context from "./store/Web2Context";
import WebSocketContext from "./store/WebSocketContext";

import { getHour, makeid, getKeyChained } from "./utils";
import tokensImg from './utils/tokens';

import { ConnectWallet } from "./components/WagmiWallet/ConnectWallet";
import NavBar from './components/NavBar';

import { useChannel } from 'ably/react';
import {
  useAccount,
} from 'wagmi';
import { LoadingOutlined, EnterOutlined } from '@ant-design/icons';
import { Modal, Input, message, Timeline } from "antd";

//import "antd/dist/antd.css";
import "nes.css/css/nes.min.css";

import phaserGame, { scenesName } from './PhaserGame';

function App() {
  const store = useContext(GameContext);
  const objects: Objects = config.game.objects;

  const [countLoader, setCountLoader] = useState(1);
  const [initial, setInitial] = useState(true);
  const [dialogSign, setDialogSign] = useState('');

  // Map
  const [currentMap, setCurrentMap] = useState('OverWorldScene');

  // Player
  const [player, setPlayer] = useState<any | null>(null);
  const [playerPos, setPlayerPos] = useState<PlayerPos | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerNfts, setPlayerNfts] = useState<any[]>([]);
  const [multiplayerNames, setMultiplayerNames] = useState<string[]>([]);

  // menu display
  const [stepMenu, setStepMenu] = useState(0);
  const [questMenu, setQuestMenu] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // during quest
  const [signText, setSignText] = useState('');
  const [stepDialogQuest, setStepDialogQuest] = useState<number>(0);
  const [dialogQuest, setDialogQuest] = useState<string | GoalLine>('');
  const [dialogChooseOpt, setDialogChooseOpt] = useState<number>(0);
  const [successText, setSuccessText] = useState('');
  const [progressionQuest, setProgressionQuest] = useState<string[]>([]);
  //const [pendingTransaction, setPendingTransaction] = useState(false);
  const [breakGame, setBreakGame] = useState(true);

  const {
    address,
    //chainId,
    isConnecting,
    isConnected,
  } = useAccount();

  const web3 = useContext(Web3Context);
  const web2 = useContext(Web2Context);
  const webSocket = useContext(WebSocketContext);

  // Loader (for debug)
  useEffect(() => {
    if (phaserGame.scene.keys.OverWorldScene) {
      setCountLoader(0);
    }
    const tmpName = makeid(10);
    setPlayerName(tmpName);
    webSocket.setPlayerName(tmpName);
  }, []);

  useEffect(() => {
    if (address) web2.addUserAction('connect-wallet');
  }, [address]);

  useEffect(() => {
    if (address && web3.nfts) {
      web2.addUserAction('mint-wallet');
      handleDialogQuest(signText);
    }
  }, [web3.nfts]);

  // After loading screen
  // Init PhaserJS & Quest
  useEffect(() => {
    if (countLoader > 0) {
      setTimeout(async () => {
        if (countLoader > 0 && store) {
          setCountLoader(0);

          if (initial && phaserGame.scene.keys.OverWorldScene) {
            setInitial(false);
            initGame();

            // init player position
            const OverWorldScene = phaserGame.scene.keys.OverWorldScene;
            OverWorldScene.events.emit('position');
          }
        }
        else if (countLoader > 0) setCountLoader(countLoader + 1);
      }, 1000);
    }
  }, [countLoader]);

  useEffect(() => {
    webSocket.sendMove(playerName, playerPos);
  }, [playerPos]);

  useEffect(() => {
    if (signText
      && objects[currentMap]
      && objects[currentMap][signText]
      && objects[currentMap][signText].default) {
      handleDialogQuest(signText);
      handleBreak();
    }
  }, [signText]);

  useEffect(() => {
    if (typeof dialogQuest === 'object' && dialogQuest.action === 'choose-text')
      web2.addUserAction('choose-text');
  }, [dialogQuest]);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleDialogQuest(dialogSign);
        if (successText) setSuccessText('');
        document.removeEventListener("keydown", listener);
      } else if (event.keyCode === 37 || event.keyCode === 39) {
        const typeOfChoose = event.keyCode === 37 ? -1 : 1;
        if (typeof dialogQuest === 'object' && dialogQuest.action === 'choose-text' && dialogQuest.messages) {
          const newChoose = getKeyChained(dialogQuest.messages.length, typeOfChoose, dialogChooseOpt);
          setDialogChooseOpt(newChoose);
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [dialogSign, dialogQuest, dialogChooseOpt]);

  const initGame = () => {
    for (let i = 0; i < scenesName.length; i++) {
      phaserGame.scene.keys[scenesName[i]].events.on('player', (player: any) => {
        if (!player) return;
        setPlayer(player);
        setPlayerPos({ x: player.x, y: player.y, map: scenesName[i] });
      });
      phaserGame.scene.keys[scenesName[i]].events.on('sign', (text: string) => {
        setSignText(text);
        phaserGame.scene.keys[currentMap].events.on('sign', (text: string) => setSignText(text));
      });
      phaserGame.scene.keys[scenesName[i]].events.on('map', (newMap: string) => {
        setCurrentMap(newMap);
        webSocket.sendMove(playerName, { x: 0, y: 0, map: newMap });
      });
    }
  }

  /*const handleMenu = () => {
    if (!store.user || countLoader) return false;
    setIsMenuVisible(!isMenuVisible);
    setStepMenu(0);
    handleBreak();
    if (successText)
      setSuccessText('');
  }*/

  // When player can move or not
  const handleBreak = (mbreak?: boolean) => {
    const breakTime = mbreak !== undefined ? mbreak : !breakGame;
    setBreakGame(breakTime);
    for (let i = 0; i < scenesName.length; i++) {
      phaserGame.scene.keys[scenesName[i]].events.emit('break');
    }
  }

  const handleTeleport = (map: string) => {
    setCountLoader(1);
    phaserGame.scene.keys[currentMap].events.emit('movetomap', { previousMap: currentMap, newMap: map });
    setCurrentMap(map);
    web2.addUserAction('teleport');
    //webSocket.sendMove(playerName, { x: 0, y: 0, map: map });
    //handleBreak();
  }

  // Get current Quest and manage the text displayed or action needed
  // todo: what if a pnj have multiple quests ?
  const handleDialogQuest = (text: string) => {
    // if (!store.quest) return false;
    if (!text || !objects[currentMap]) return;
    else if (!objects[currentMap][text] && dialogSign !== text) return setDialogSign(text);
    else if (!objects[currentMap][text] && dialogSign === text) return handleQuitDialog();

    const currentObj = objects[currentMap][text];
    const questObj = currentObj.quests;
    const quests: Quests = config.game.quests;
    let currentQuest = '';
    if (questObj && questObj.length && web2.user) {
      for (let i = 0; i < web2.user.quests.length; i++) {
        if (web2.user.quests[i] === questObj[0])
          currentQuest = questObj[0];
      }
    }
    if (currentQuest && web2.user?.quests.length) {
      const questInfo = quests[currentQuest];
      const questPnj = questInfo.goalOrder[currentMap] && questInfo.goalOrder[currentMap][text];
      let canUpdate = false;
      if (questPnj.dialogs && dialogQuest && stepDialogQuest + 1 < questPnj.dialogs.length) { // update w cond
        const lastUserAction = web2.user.actions && web2.user.actions[web2.user.actions.length - 1];
        const ndialog = questPnj.dialogs[stepDialogQuest];
        if (typeof ndialog === 'object' && ndialog.action) {
          const actionTodo = ndialog.action;
          if (lastUserAction === actionTodo) canUpdate = true;
        } else canUpdate = true;
      } else if (questPnj.dialogs && !dialogQuest) { // init
        setDialogQuest(questPnj.dialogs[stepDialogQuest]);
        setDialogSign(text);
        setProgressionQuest([...progressionQuest, currentMap + '-' + text]);
      }
      else { // quit
        return handleQuitDialog();
      }
      if (canUpdate) {
        setStepDialogQuest(stepDialogQuest + 1);
        setDialogQuest(questPnj.dialogs ? questPnj.dialogs[stepDialogQuest + 1] : '');
        setDialogSign(text);
      }
    } else if (!currentQuest && dialogSign != text) setDialogSign(text);
    else handleQuitDialog();
  }

  const handleQuitDialog = () => {
    setDialogSign('');
    setStepDialogQuest(0);
    setDialogQuest('');
    handleBreak();
    checkProgression();
  }

  // todo check other conds
  const checkProgression = () => {
    if (!web2.user) return;
    const userQ = web2.user.quests;
    //progressionQuest;
    for (let i = 0; i < userQ.length; i++) {
      // si quests all done
      const q = config.game.quests[userQ[i]].goalOrder;
      const success = config.game.quests[userQ[i]].success;
      const qMap = Object.keys(q);
      const qMapOrderTotal = qMap.concat(...qMap.map(e => Object.keys(q[e]).map(e2 => e + '-' + e2))).filter(e => e.split('-').length > 1);
      if (qMapOrderTotal.join(',') === progressionQuest.join(',')) {
        setProgressionQuest([]);
        if (success.action === 'teleport')
          handleTeleport(success.destination);
        setSuccessText(success.message);
      }
    }
  }

  return (
    <div className="App">

      {/* Loader Screen */}
      {countLoader > 0 && <div style={{ background: '#000000d1', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingOutlined style={{
          maxWidth: '50px',
          fontSize: '50px',
          color: 'white',
          marginBottom: '20px',
        }} />
        <p style={{ color: 'white' }}>Loading...</p>
      </div>}

      {/* Title & Menu Btn*/}
      {/*countLoader === 0 && <NavBar
        onClick={handleMenu}
        isConnected={!!address}
        version={config.version}
        gameTitle={config.game.name}
        multiplayer={address ? multiplayerNames.length + 1 : 0}
      />*/}

      {/* Dialog modal */}
      {dialogSign && (((objects[currentMap][dialogSign] && objects[currentMap][dialogSign].default)) || dialogQuest) && <div onClick={() => handleDialogQuest(dialogSign)} className="dialogSign nes-container is-rounded with-title">
        {objects[currentMap][dialogSign].name && <p className="title">{objects[currentMap][dialogSign].name}</p>}
        <p style={{ maxWidth: '90vw' }}>{!dialogQuest && objects[currentMap][dialogSign].default}</p>
        <p style={{ maxWidth: '90vw' }}>{typeof dialogQuest === 'string' && dialogQuest}</p>
        <p style={{ maxWidth: '90vw', marginBottom: '10px' }}>{typeof dialogQuest === 'object' && dialogQuest.message}</p>
        {typeof dialogQuest === 'object' && dialogQuest.action === 'connect-wallet' && <>
          <>
            {!isConnected && !isConnecting && <ConnectWallet
              onDisconnect={() => { console.log('disconnect') }}
            />}
            {isConnecting && <div className="btnBox nes-btn is-primary"><LoadingOutlined style={{ fontSize: '50px', color: 'white', }} /></div>}
            {isConnected && <p onClick={() => { if (web2.user?.actions[web2.user.actions.length - 1] != 'connect-wallet') web2.addUserAction('connect-wallet'); }} className='btnDialog'>Press to continue</p>}
          </>
        </>}
        {typeof dialogQuest === 'object' && dialogQuest.action === 'mint-wallet' && address && <p
          className="btnBox nes-btn is-primary" style={{ padding: '0 10px' }} onClick={() => !web3.loadingMint && web3.actionMint(address, (dialogChooseOpt + 1) + '')}>
          {!web3.loadingMint && <span style={{ color: 'white', fontSize: '16px' }}>Mint</span>}
          {web3.loadingMint && <LoadingOutlined style={{ fontSize: '20px', color: 'white', }} />}
        </p>}
        {typeof dialogQuest === 'object' && dialogQuest.action === 'choose-text' && <span style={{ maxWidth: '90vw', display: 'flex' }}>
          {dialogQuest.messages && dialogQuest.messages.map((e: string, n: number) => <span onClick={() => setDialogChooseOpt(n)} className={n === dialogChooseOpt ? 'btnDialog selected' : 'btnDialog'} key={n}>{e}</span>)}
        </span>}
        {typeof dialogQuest === 'object' && dialogQuest.link && <span className='linkDialog'>{dialogQuest.link}</span>}
        <span className="enterBtn"><EnterOutlined /></span>

        {/* <span className="dialogCursor"></span> */}
        {/*dialogQuest && <p style={{
          fontSize: "12px",
          position: "absolute",
          right: "30px",
          bottom: "5px",
        }}>Keep listening...</p>*/}
      </div>}

      {/* Success Quest */}
      {successText && <div onClick={() => setSuccessText('')} className="dialogSign nes-container is-rounded with-title">
        {successText}
        <span className="enterBtn"><EnterOutlined /></span>
      </div>}

      {
        countLoader === 0 && currentMap !== 'WelcomeScene' && (web2.user && !web2.user.address) && <div style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 1 }}>
          <p
            onClick={() => handleTeleport('WelcomeScene')}
            className="btnBox nes-btn is-primary" style={{ padding: '0 10px' }}>
            <span style={{ color: 'white', fontSize: '16px' }}>Start Game</span>
          </p>
        </div>
      }

      {/*countLoader > 0 && <div className="loaderInGame">
          <LoadingOutlined style={{
            maxWidth: '20px',
            fontSize: '20px',
            color: 'black',
            marginLeft: '5px',
            marginRight: '15px',
          }} />
          <p>Because...</p>
        </div> */
      }
    </div >
  )
}

export default App
