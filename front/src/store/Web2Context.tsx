import React, { useEffect, useState } from "react";
import { buildRequest, replaceParametersInUrl } from "../utils/index";
import config, { apiServer } from "../config/index";
import { Player, Web2Context } from "./types";
import { makeid } from "../utils";

const Web2Context = React.createContext<Web2Context>({
    user: null,
    inventory: null,
    loadingUser: false,
    getUser: () => { },
    addUserAction: () => { },
});

type Props = {
    children: React.ReactNode;
};

export const Web2ContextProvider = (props: Props) => {
    const [user, setUser] = useState<Player | null>(null);
    const [inventory, setInventory] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        if (!user) {
            // default user
            setUser({
                name: makeid(10),
                address: '',
                quests: config.game.defaultPlayer.quests,
                questsDone: [],
                actions: [],
            });
        }
    }, []);

    useEffect(() => {
        console.log({ user });
    }, [user]);

    const getUser = async (address: string) => {
        setLoadingUser(true);
        try {
            const url = replaceParametersInUrl(apiServer.playerAddressGet.url, { address });
            const rsp = await buildRequest(
                url,
                apiServer.playerGet.method,
            );
            if (rsp.error) throw rsp.error;
            setUser(rsp);
            setLoadingUser(false);
        } catch (e) {
            console.log({ e });
        }
    }

    const addUserAction = (newAction: string) => {
        if (!user) return;
        const currentAction = user.actions;
        currentAction?.push(newAction);
        setUser({ ...user, actions: currentAction });
    }

    return (
        <Web2Context.Provider
            value={{
                user,
                inventory,
                loadingUser,
                getUser,
                addUserAction,
            }}
        >
            {props.children}
        </Web2Context.Provider>
    );
};

export default Web2Context;