import React, { useEffect, createContext, useState } from "react";

import config from '../config';
import { storageData, getStorage, rmStorage } from './localStorage';
import { User, Quests, Quest } from './types';

const defaultUser: User = {
    name: 'User 1',
    level: 1,
    newLevel: false,
    loadingLevel: false,
};

interface IContextStore {
    quests: Quests;
    quest: Quest | null;
    currentQ: string;
    user: User | null;
    getNextQuest: Function;
    getPrevQuest: Function;
    setNewQuestViewed: Function;
    setNewLevelViewed: Function;
    resetGame: Function;
    loadAFlag: Function;
};

const GameContext = createContext({
    quests: config.game.quests,
    quest: null,
    currentQ: '',
    wifi: [],
    user: null,
    getNextQuest: () => { },
    getPrevQuest: () => { },
    setNewQuestViewed: () => { },
    setNewLevelViewed: () => { },
    resetGame: () => { },
    loadAFlag: () => { },
} as IContextStore);

export const GameContextProvider = (props: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [quest, setQuest] = useState<Quest | null>(null);
    const [currentQ, setCurrentQ] = useState<string>('');

    useEffect(() => {
        const initGame = async () => {
            const u = await getStorage('user');
            await setUser(u ? u : defaultUser);
            await storageData('user', u ? u : defaultUser);
            //await setWifi(config.game.wifi)
            await initQuest(u ? (u.level - 1) : 0, u ? u : defaultUser);
            console.log(config.game.name + ' ready to play!');
        }

        initGame();
    }, []);

    // get flag for current quest
    const initQuest = (index: number, pUser?: User) => {
        const quests: Quests = config.game.quests;
        const keys = Object.keys(quests);
        if (index < keys.length) {
            setCurrentQ(keys[index]);
            setQuest(quests[keys[index]]);
            //const checkUser = pUser ? pUser : user;
        }
    }

    // change level user + save in localstorage
    const increaseUser = (newLevel: boolean) => {
        const newU = user;
        if (newU) {
            newU.level = newU.level + 1;
            newU.newLevel = newLevel;
            setUser(newU);
            storageData('user', newU);
        }
    }

    const getPrevQuest = () => {
        const quests: Quests = config.game.quests;
        const keys = Object.keys(quests);
        const index = keys.indexOf(currentQ);
        if (index - 1 >= 0)
            return keys[index - 1];
        return '';
    }

    // if return '' => no more quest
    const getNextQuest = () => {
        const quests: Quests = config.game.quests;
        const keys = Object.keys(quests);
        const index = keys.indexOf(currentQ);
        if (index + 1 < keys.length) {
            increaseUser(true);
            initQuest(index + 1);
            return keys[index + 1];
        } else {
            // end of the game
            increaseUser(false);
        }
        return '';
    }

    const setNewQuestViewed = () => {
        const newU = user;
        if (newU) {
            newU.newLevel = false;
            setUser(newU);
            storageData('user', newU);
        }
    }

    const setNewLevelViewed = () => {
        const newU = user;
        if (newU) {
            newU.loadingLevel = false;
            setUser(newU);
            storageData('user', newU);
        }
    }

    const resetGame = () => {
        rmStorage('user');
        window.location.href = window.location.href;
    }

    const loadAFlag = (flag: string) => {
        const quests: Quests = config.game.quests;
        const flagList = Object.keys(quests);
        const questIndex = flagList.indexOf(flag);
        if (questIndex === -1 || !user) {
            return false;
        }
        const newU = user;
        const quest = quests[flagList[questIndex]];
        newU.level = questIndex + 1;
        newU.newLevel = true;
        newU.loadingLevel = true;
        storageData('user', newU);

        //relaunch
        window.location.href = window.location.href;
    }

    return (
        <GameContext.Provider
            value={{
                quests: config.game.quests,
                quest,
                currentQ,
                user,
                getNextQuest,
                getPrevQuest,
                setNewQuestViewed,
                setNewLevelViewed,
                resetGame,
                loadAFlag,
            }}>
            {props.children}
        </GameContext.Provider>
    )
}

export default GameContext;