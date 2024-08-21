import React, { useState, useEffect, useContext } from 'react';

import config from './config';
import GameContext from "./store";
import { getHour } from "./utils";
import { useChannel } from 'ably/react';
import {
  useAccount,
} from 'wagmi';
import { scrollSepolia } from "./config/wagmiConfig";
import { ConnectWallet } from "./components/WagmiWallet/ConnectWallet";

import {
  Objects,
} from "./store/types";

import './App.css';
import "antd/dist/antd.css";
import "nes.css/css/nes.min.css";

import phaserGame from './PhaserGame';

import NavBar from './components/NavBar';
import PixelPhone from './components/PixelPhone';
import PhoneNFT, { PhoneNFTTiled } from './components/PhoneNFT';
import { PhoneAimTiled } from './components/PhoneAim';
import { PhoneContactTiled } from './components/PhoneContact';
import { PhoneCallTiled } from './components/PhoneCall';
import { PhoneMailTiled } from './components/PhoneMail';
import { PhoneMessageTiled } from './components/PhoneMessage';
import ComputerScreen from './components/ComputerScreen';

import Web3Context from "./store/Web3Context";
import tokensImg from './utils/tokens';

import { WifiOutlined, ThunderboltOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Input, message, Timeline } from "antd";

const { Search } = Input;

type PlayerPos = {
  x: number;
  y: number;
};

function App() {
  const store = useContext(GameContext);
  const objects: Objects = config.game.objects;
  ///////////////
  const [countLoader, setCountLoader] = useState(1);
  const [dialogSign, setDialogSign] = useState('');

  // screen display
  const [screenVisible, setScreenVisible] = useState(false);
  const [stepScreenComputer, setStepScreenComputer] = useState<string | undefined>('');

  // phone display
  const [stepPhone, setStepPhone] = useState('');
  const [phoneConnected, setPhoneConnected] = useState<string[]>([]);
  const [phoneVisible, setPhoneVisible] = useState(false);

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
  const [stepDialogQuest, setStepDialogQuest] = useState(0);
  const [dialogQuest, setDialogQuest] = useState('');
  const [successText, setSuccessText] = useState('');
  const [progressionQuest, setProgressionQuest] = useState<string[]>([]);
  const [pendingTransaction, setPendingTransaction] = useState(false);
  const [breakGame, setBreakGame] = useState(true);

  const {
    address,
    chainId,
    isConnecting,
    isConnected,
  } = useAccount();

  const {
    nfts,
    getNfts,
    loadingNft,
    loadingMint,
    loadingApprove,
    loadingSendNft,
    loadingSwitch,
    isFirstTokenApproved,
    actionMint,
    //getApprovedNFT,
    approveNFT,
    sendNFT,
    isGoodChain,
    switchChain,
    parseOwnedNFTs,
  } = useContext(Web3Context);

  // ably - socketIO management
  const [playerInteraction, setPlayerInteraction] = useState<any>(null);
  const channelPlayersMove = useChannel({ channelName: 'players-move', ablyId: 'dk1dcw' }, (message) => {
    // console.log(message);
    const data = JSON.parse(message.data);

    if (data && data.x && data.y) {
      // if message is another player
      if (message.name !== playerName && message.name) {
        if (phaserGame.scene.keys.OverWorldScene) {
          phaserGame.scene.keys.OverWorldScene.events.emit('moveanotherplayer', { name: message.name, pos: data });
        }
        if (multiplayerNames.indexOf(message.name) === -1)
          setMultiplayerNames([...multiplayerNames, message.name]);
      }
    }
  });
  const channelPlayersInteraction = useChannel({ channelName: 'players-interactions', ablyId: 'dk1dcw' }, (interaction) => {
    const data = JSON.parse(interaction.data);
    // if interaction is about position
    if (data && data.action) {
      // if interaction is another player
      if (interaction.name === playerName && data.action.split('-')[0] === 'interaction') {
        handleBreak();
        const tokenID = data.action.split('-').length > 1 ? data.action.split('-')[1] : '';
        setPlayerInteraction({ from: data.by, tokenID: tokenID ? tokenID : '' });
      }
      else if (interaction.name === playerName && data.action === 'close-interaction') {
        message.warning('Interaction closed by user');
        handleBreak();
        setPlayerInteraction(null);
      }
      else if (data.action === 'success-interaction') {
        message.success('Transaction confirmed.');
        handleBreak();
        setPlayerInteraction(null);
      }
    }
  });

  /*useConnectionStateListener((stateChange) => {
    console.log(stateChange.current);  // the new connection state
    console.log(stateChange.previous); // the previous connection state
    console.log(stateChange.reason);   // if applicable, an error indicating the reason for the connection state change
  }, 'dk1dcw');*/

  // add multiplayer to map according to last 5min socket
  const fetchHistory = async (playerName: string) => {
    const data = await channelPlayersMove.channel.history();
    const historyUsers: { [n: string]: any } = {};
    if (data && data.items) {
      for (let i = 0; i < data.items.length; i++) {
        const name = data.items[i].name ? data.items[i].name : "";
        if (name === playerName) continue;
        if (name && Object.keys(historyUsers).indexOf(name) === -1) {
          historyUsers[name] = {
            data: JSON.parse(data.items[i].data),
          };
        }
      }
      // add multiplayer to map
      for (let i = 0; i < Object.keys(historyUsers).length; i++) {
        const name = Object.keys(historyUsers)[i];
        phaserGame.scene.keys.OverWorldScene.events.emit('moveanotherplayer', {
          name,
          pos: historyUsers[name].data
        });
        if (multiplayerNames.indexOf(name) === -1)
          setMultiplayerNames([...multiplayerNames, name]);
      }
    }
  }

  const sendMoveToSocket = () => {
    if (playerPos && playerName)
      channelPlayersMove.channel.publish(playerName, JSON.stringify(playerPos));
  }
  const sendInteractionPlayer = (playerName: string, name: string, action: string) => {
    if (name && action)
      channelPlayersInteraction.channel.publish(name, JSON.stringify({ action, by: playerName }));
  }

  // get new coord and save to websocket
  // playerPos is update when player move
  // thanks to base->update()
  useEffect(() => {
    sendMoveToSocket();
  }, [playerPos]);

  // when nfts are updated
  // update player's nfts and check quest progress
  useEffect(() => {
    if (playerName && nfts) {
      const currentNfts = nfts as unknown;
      const nftsOwned = parseOwnedNFTs(currentNfts as [{ from: `0x${string}`, to: `0x${string}`, tokenID: string }], playerName);
      if (playerNfts.length > nftsOwned.length)
        handleWeb3Success();
      setPlayerNfts(nftsOwned);
    }
  }, [nfts]);

  // init the web3 game here
  useEffect(() => {
    if (address && countLoader === 0 && phaserGame.scene.keys.OverWorldScene) {
      setPlayerName(address);
      setPlayerNamePhaser(address);
      handleBreak();
      fetchHistory(address);
      getNfts();
    }
  }, [address, isConnected, countLoader]);

  // add listener when web3 connected
  useEffect(() => {
    if (playerName)
      handleEventClickOnPlayer();
  }, [playerName]);

  // Quest handler with Web3
  useEffect(() => {
    if (loadingMint && !pendingTransaction)
      setPendingTransaction(true);
    else if (!loadingMint && pendingTransaction) {
      setPendingTransaction(false);
      if (playerNfts && playerNfts.length)
        handleWeb3Success();
    }
  }, [loadingMint]);

  // when sign change
  // sign are generally interaction with NPC
  useEffect(() => {
    if (store.user && !stepDialogQuest && !stepScreenComputer) {
      if (store.quest) {
        const questGoal = Object.keys(store.quest.goalOrder).filter(elt => store.quest && !store.quest.goalOrder[elt].optional);
        const order = questGoal.indexOf(signText) === -1 ? 0 : questGoal.indexOf(signText);
        const orderRespected = store.quest.orderFix ? order === progressionQuest.length : true;
        if (store.quest.goalOrder[signText] && orderRespected && progressionQuest.indexOf(signText) === -1) {
          if (store.quest.goalOrder[signText].computerScreen) {
            setStepScreenComputer(store.quest.goalOrder[signText].computerMode);
            handleScreen(true);
          }
          else handleDialogQuest(signText);
        } else setDialogSign(signText);
      }
      else setDialogSign(signText);
    }
  }, [signText]);

  // After loading screen
  // Init PhaserJS & Quest
  useEffect(() => {
    if (countLoader > 0) {
      setTimeout(async () => {
        if (countLoader > 0 && store && store.user && phaserGame.scene.keys.OverWorldScene) {
          setCountLoader(0);

          // ADD HANDLER FOR EVENTS
          /*phaserGame.scene.keys.OverWorldScene.events.on('keyboard', (inputKeyboard: any) => {
            if (inputKeyboard && dialogQuest && inputKeyboard.key === 'Enter') {
              handleDialogQuest(dialogQuest);
            }
          });*/

          phaserGame.scene.keys.OverWorldScene.events.on('sign', (text: string) => setSignText(text));
          phaserGame.scene.keys.SoftwareScene.events.on('sign', (text: string) => setSignText(text));
          phaserGame.scene.keys.OverWorldScene.events.on('player', (player: any) => {
            if (!player) return;
            setPlayer(player);
            setPlayerPos({ x: player.x, y: player.y });
          });

          // check loading quest
          if (store.user.loadingLevel) {
            const prevQuestFinished = store.getPrevQuest();
            if (prevQuestFinished) setSuccessText(store.quests[prevQuestFinished].success + '\n\nYou now have a new quest available in your menu.');
            setIsMenuVisible(true);
            handleBreak();
            store.setNewLevelViewed();
          }

          // init player position
          getUserPosition();
        }
        else if (countLoader > 0) setCountLoader(countLoader + 1);
      }, 1000);
    }
  }, [countLoader]);

  const handleEventClickOnPlayer = async () => {
    phaserGame.scene.keys.OverWorldScene.events.on('clickOnPlayer', (player: any) => {
      if (!player) return;
      if (!playerInteraction) {
        handleBreak();
        // const nft = '';
        const tokenID = ''; // nft && nft.tokenID ? nft.tokenID : '';
        setPlayerInteraction({ ...player, from: playerName, tokenID });
        const action = 'interaction-' + tokenID;
        sendInteractionPlayer(playerName, player.name, action);
      }
    });
  }

  // Quest update
  // only for level 1 & 2
  const handleWeb3Success = async () => {
    if (store.user && store.user.level > 2) return false;
    if (!store.quest) return false;
    const cQ = progressionQuest;
    cQ.push('web3');
    await setProgressionQuest(cQ)
    await checkQuest();
  }

  // When player can move or not
  const handleBreak = (mbreak?: boolean) => {
    const breakTime = mbreak !== undefined ? mbreak : !breakGame;
    setBreakGame(breakTime);
    const OverWorldScene = phaserGame.scene.keys.OverWorldScene;
    const SoftwareScene = phaserGame.scene.keys.SoftwareScene;
    OverWorldScene.events.emit('break');
    SoftwareScene.events.emit('break');
  }

  const handleMint = (owner: `0x{string}`) => {
    const randCoinWin = Math.floor((Math.random() * 7) + 1);
    actionMint(owner, randCoinWin + "");
  }

  const handlePhone = () => {
    if (!store.user || countLoader || loadingMint) return false;
    checkConnected();
    setPhoneVisible(!phoneVisible);
    handleBreak();
  }

  const handleSendNFT = async (from: `0x{string}`, to: `0x{string}`, idToken: number) => {
    if (!playerNfts.length) {
      message.error('You dont have any NFTs.');
      return false;
    }
    if (!isFirstTokenApproved)
      await approveNFT(from, idToken);
    else
      await sendNFT(from, idToken, to);
  }

  const handleMenu = () => {
    if (!store.user || countLoader) return false;
    setIsMenuVisible(!isMenuVisible);
    setStepMenu(0);
    handleBreak();
    if (successText)
      setSuccessText('');
  }

  const handleScreen = (open: boolean) => {
    handleBreak();
    setScreenVisible(open);
    if (!open) setStepScreenComputer('');
  }

  const handleDialogQuest = (text: string) => {
    if (!store.quest) return false;

    const cQ = progressionQuest;
    const goal = store.quest.goalOrder[text];

    // dialog start = break movement
    if (stepDialogQuest === 0 && goal.break)
      handleBreak();
    // dialog continue
    if (goal.dialog && goal.dialog.length > stepDialogQuest) {
      setDialogSign(text);
      setDialogQuest(goal.dialog[stepDialogQuest]);
      setStepDialogQuest(stepDialogQuest + 1);
    }
    // dialog done
    else if (goal.dialog && stepDialogQuest === goal.dialog.length) {
      setDialogSign('');
      setStepDialogQuest(0);
      setDialogQuest('');
      if (!goal.optional) {
        cQ.push(text);
        setProgressionQuest(cQ);
      }
      handleBreak();
      checkQuest();
    }
  }

  const checkQuest = () => {
    if (!store.quest) return false;

    // remove optionnal
    const progression = progressionQuest.filter(elt => store.quest && store.quest.goalOrder[elt].optional ? false : true)
    const goal = Object.keys(store.quest.goalOrder).filter(elt => store.quest && store.quest.goalOrder[elt].optional ? false : true);

    // quest is success
    if (progression.join(',') === goal.join(',')) {
      const flag = store.getNextQuest();
      if (phoneVisible) handlePhone();
      if (playerInteraction) {
        sendInteractionPlayer(
          playerName,
          playerInteraction.name ? playerInteraction.name : playerInteraction.from,
          'success-interaction'
        );
      }
      if (flag) setSuccessText(store.quest.success + '\n\nFlag is: ' + flag);
      else setSuccessText(store.quest.success + '\n\nYou have completed the game.');
      setIsMenuVisible(true);
      setProgressionQuest([]);
      handleBreak();
    }
  }

  const getUserPosition = () => {
    const OverWorldScene = phaserGame.scene.keys.OverWorldScene;
    OverWorldScene.events.emit('position');
  }

  const setPlayerNamePhaser = (name: string | `0x${string}`) => {
    const OverWorldScene = phaserGame.scene.keys.OverWorldScene;
    OverWorldScene.events.emit('playerName', name);
  }

  // Network display in the phone navbar
  const checkConnected = async () => {
    await getUserPosition();
    if (player) {
      setPhoneConnected([scrollSepolia.name.replaceAll(' ', '')]);
    }
  }

  // Gestion Menu
  const menuDisplay = () => {
    const currentLevel = store.user ? store.user.level : 1;
    const newLevel = store.user ? store.user.newLevel : false;
    const enumMenu = {
      init: 0,
      enterCode: 1,
      saveCode: 2,
      option: 3,
      quests: 4,
      descQuest: 5,
      credit: 6,
    };

    const initMenu = (
      <>
        <p style={{ fontSize: '12px' }}>V {config.version} - level {currentLevel}</p>
        {/*<p onClick={() => setStepMenu(enumMenu.enterCode)}>ENTER A FLAG</p>*/}
        {/*<p onClick={() => setStepMenu(enumMenu.saveCode)}>SAVE</p>*/}
        <p onClick={() => setStepMenu(enumMenu.quests)}>
          QUESTS
          {newLevel && <span style={{ color: 'tomato', fontSize: '10px', fontWeight: 'bold', position: 'relative', bottom: '6px' }}>NEW</span>}
        </p>
        <p onClick={() => setStepMenu(enumMenu.option)}>OPTION</p>
        <p onClick={() => setStepMenu(enumMenu.credit)}>CREDIT</p>
        <p onClick={handleMenu}>EXIT</p>
      </>
    );

    const enterCodeMenu = (
      <div className="nes-field">
        <label>Enter a flag</label>
        <Search
          placeholder="Flag"
          enterButton="ENTER"
          prefix={<ThunderboltOutlined />}
          onSearch={(value) => store.loadAFlag(value)}
        />
        <p style={{ marginTop: '5px' }}>If nothing happens: your flag is false.</p>
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.init)}>BACK</p>
      </div>
    );

    const saveCodeMenu = (
      <>
        <p>Your current Flag is:</p>
        <p style={{ background: '#333', color: 'white', padding: '3px' }}>{store.currentQ}</p>
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.init)}>BACK</p>
      </>
    );

    const optionMenu = (
      <>
        <p onClick={() => store.resetGame()} style={{ background: 'tomato', color: 'white', padding: '5px', }}>Reset your game</p>
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.init)}>BACK</p>
      </>
    )

    const creditMenu = (
      <>
        <a href={config.README}>README</a>
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.init)}>BACK</p>
      </>
    )

    const availableQuests: string[] = Object.keys(store.quests).filter(e => store.quests[e].level <= currentLevel);
    const questsMenu = (
      <>
        {availableQuests.map((e: string, index: number) =>
          <p key={index} onClick={() => {
            setQuestMenu(e);
            setStepMenu(enumMenu.descQuest);
            if (index === availableQuests.length - 1 && newLevel)
              store.setNewQuestViewed();
          }
          }>
            {store.quests && store.quests[e] && store.quests[e].title}
            {(index < availableQuests.length - 1) && <span className="questDoneIcon"></span>}
            {(index === availableQuests.length - 1 && currentLevel > availableQuests.length) && <span className="questDoneIcon"></span>}
            {(index === availableQuests.length - 1) && newLevel && <span style={{ color: 'tomato', fontSize: '10px', fontWeight: 'bold', position: 'relative', bottom: '6px' }}>NEW</span>}
          </p>
        )}
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.init)}>BACK</p>
      </>
    );
    const descQuestMenu = (
      <>
        <p>{store.quests[questMenu] && store.quests[questMenu].level <= currentLevel && store.quests[questMenu].title}</p>
        <p>{store.quests[questMenu] && store.quests[questMenu].level <= currentLevel && store.quests[questMenu].desc}</p>
        <p style={{ marginTop: '15px' }} onClick={() => setStepMenu(enumMenu.quests)}>BACK</p>
      </>
    )

    const stepArr = [initMenu, enterCodeMenu, saveCodeMenu, optionMenu, questsMenu, descQuestMenu, creditMenu]
    return (<div>
      {stepArr[stepMenu]}
    </div>);
  }

  return (
    <div className="App">
      {/* Title & Menu Btn*/}
      {countLoader === 0 && <NavBar
        onClick={handleMenu}
        isConnected={!!address}
        version={config.version}
        gameTitle={config.game.name}
        multiplayer={address ? multiplayerNames.length + 1 : 0}
      />}

      {/* Web3 Handler */}
      {!address && countLoader === 0 && <div style={{
        position: 'absolute',
        top: '40vh',
        bottom: '0px',
        zIndex: '2',
        left: '0',
        right: '0',
      }}>
        {!isConnecting && <ConnectWallet
          onDisconnect={() => { console.log('disconnect') }}
        />}
        {isConnecting && <div className="btnBox nes-btn is-primary"><LoadingOutlined style={{ fontSize: '50px', color: 'white', }} /></div>}
      </div>}
      {address && countLoader === 0 && <div style={{
        position: 'absolute',
        top: '22px',
        right: '10px',
        zIndex: '2',
      }}>
        <ConnectWallet
          onDisconnect={() => { console.log('disconnect'); handleBreak(); }}
        />
      </div>}

      {/* Loader Screen */}
      {countLoader > 0 && <div style={{ background: 'black', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
        <LoadingOutlined style={{ fontSize: '50px', color: 'white', marginBottom: '20px' }} />
        <p style={{ color: 'white' }}>Loading...</p>
      </div>}

      {/* Phone Btn */}
      {address && countLoader === 0 && store.user && <div onClick={handlePhone} className="phoneBtn">
        <p className="nes-btn is-primary" style={{ padding: '0 10px' }}>
          <span style={{ color: 'white' }}>Phone</span>
        </p>
      </div>}

      {/* Dialog modal */}
      {dialogSign && (objects[dialogSign].default || dialogQuest) && <div onClick={dialogQuest ? () => handleDialogQuest(dialogSign) : () => { }} className="dialogSign nes-container is-rounded with-title">
        {objects[dialogSign].name && <p className="title">{objects[dialogSign].name}</p>}
        <p>{dialogQuest ? dialogQuest : objects[dialogSign].default}</p>
        {dialogQuest && <span className="dialogCursor"></span>}
        {dialogQuest && <p style={{
          fontSize: "12px",
          position: "absolute",
          right: "30px",
          bottom: "5px",
        }}>Keep listening...</p>}
      </div>}

      {/* Modal for Menu & Success Quest */}
      <Modal
        title=""
        footer={[]}
        closable={false}
        wrapClassName="menuGame"
        open={isMenuVisible}
        onCancel={handleMenu}>
        {!successText ? menuDisplay() : successText.split("\n").map((item, idx) => (
          <span key={idx}>
            {item}
            <br />
          </span>
        )
        )}
      </Modal>

      {/* Modal for Player Interaction */}
      <Modal
        title=""
        footer={[]}
        closable={!loadingApprove && !loadingNft && !loadingSendNft}
        wrapClassName="menuGame"
        open={!!playerInteraction}
        onCancel={() => {
          handleBreak();
          if (playerInteraction) {
            sendInteractionPlayer(
              playerName,
              playerInteraction.name ? playerInteraction.name : playerInteraction.from,
              'close-interaction'
            );
          }
          setPlayerInteraction(null);
        }}>
        {playerInteraction && <p style={{ fontSize: '10px' }}>Interaction with {playerInteraction.name ? playerInteraction.name : playerInteraction.from}</p>}
        <br />
        {/* External call */}
        {playerInteraction && playerInteraction.from && !playerInteraction.name && <>
          <div>
            <h6 style={{ marginBottom: '20px' }}>The player is trying to send you a NFT</h6>
            {playerInteraction.tokenID && <div style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
              <div style={{
                background: '#ffcb94',
                borderRadius: '50%',
                maxWidth: '70px',
                padding: '11px',
                margin: '5px',
              }}>
                <img
                  style={{ maxWidth: '45px' }}
                  src={
                    tokensImg[parseInt(playerInteraction.tokenID.slice(-1)) - 1]
                  }
                  alt={'NFT'}
                />
              </div>
              <h6>{playerInteraction.tokenID}</h6>
            </div>}
            <p>Please wait</p>
            <LoadingOutlined style={{ fontSize: '25px', color: 'black' }} />
          </div>
        </>}
        {/* You initiated */}
        {playerInteraction && playerInteraction.name && <>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', flexDirection: 'row', paddingBottom: '40px' }}>
            <p
              className="nes-btn is-primary"
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => handleSendNFT(playerName as `0x{string}`, playerInteraction.name, playerNfts[0] ? parseInt(playerNfts[0].tokenID) : 0)}
            >
              {!loadingApprove && !isFirstTokenApproved && <span>Approve NFT Transfer</span>}
              {!loadingApprove && !loadingSendNft && isFirstTokenApproved && <span>Send NFT</span>}
              {(loadingApprove || loadingSendNft) && <LoadingOutlined style={{ fontSize: '15px', color: 'white' }} />}
            </p>
            <div style={{ textAlign: 'center' }}>
              {nfts && playerNfts.length > 0
                && <div style={{
                  background: '#ffcb94',
                  borderRadius: '50%',
                  maxWidth: '70px',
                  padding: '11px',
                  margin: '5px',
                }}>
                  <img
                    style={{ maxWidth: '45px' }}
                    src={
                      tokensImg[parseInt(playerNfts[0].tokenID.slice(-1)) - 1]
                    }
                    alt={'NFT'}
                  />
                </div>}
              <h6>{playerNfts[0] && playerNfts[0].tokenID}</h6>
            </div>
          </div>
          <Timeline style={{ marginTop: '15px' }}>
            <Timeline.Item color={isFirstTokenApproved ? "green" : "red"}><p style={{ color: isFirstTokenApproved ? 'green' : '' }}>Approve the transfer</p></Timeline.Item>
            <Timeline.Item color="red"><p>Transfer a NFT</p></Timeline.Item>
          </Timeline>
        </>}
      </Modal>

      {/* Modal for Computer Screen */}
      <Modal
        title=""
        footer={[<p key={0} onClick={() => handleScreen(false)}>close</p>]}
        closable={false}
        wrapClassName="computerScreen"
        open={screenVisible}
        onCancel={() => handleScreen(false)}>
        <ComputerScreen
          mode={stepScreenComputer}
          started={0}
        />
      </Modal>

      {/* Modal for Phone content */}
      <Modal
        title=""
        footer={[]}
        closable={false}
        wrapClassName="phoneGame"
        open={phoneVisible}
        onCancel={handlePhone}>
        <PixelPhone>
          <div className="barPhone">
            {player
              && isGoodChain(chainId)
              && phoneConnected.length > 0
              && <span><WifiOutlined style={{ fontSize: '12px' }} /> {phoneConnected[0]}</span>}
            {!isGoodChain(chainId) && <span>No network</span>}
            <p>{getHour()}</p>
          </div>
          {address && !isGoodChain(chainId) && <div>
            <p style={{ marginTop: '15px' }}>Switch to Scroll Sepolia to continue.</p>
            <div onClick={() => switchChain()} className="btnBox nes-btn is-primary">
              {!loadingSwitch && <span>Switch now</span>}
              {loadingSwitch && <LoadingOutlined style={{ color: 'white', }} />}
            </div>
          </div>}
          {address && isGoodChain(chainId) && <>
            {player && address && stepPhone === 'nft'
              && <PhoneNFT
                isLoading={loadingNft || loadingMint}
                launchMint={handleMint}
                nfts={playerNfts}
                owner={address}
                onCancel={() => setStepPhone('')}
              />}
            {!stepPhone && <div className="phoneContainer">
              <PhoneNFTTiled onClick={() => setStepPhone('nft')} />
              <PhoneAimTiled actif={false} />
              <PhoneContactTiled />
              <PhoneMailTiled />
              <PhoneCallTiled />
              <PhoneMessageTiled />
            </div>}
          </>}
        </PixelPhone>
      </Modal>
    </div >
  )
}

export default App
