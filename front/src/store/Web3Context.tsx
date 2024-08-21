// @ts-nocheck

import React, { useEffect, useState } from "react";
import NFT_CARD from '../contracts/Card.json';
import ERC20 from '../contracts/Jenis.json';

import config from "../config/index";
import { publicClient, walletClient, scrollSepolia } from "../config/wagmiConfig";
import { fromHex } from "viem";

const Web3Context = React.createContext({
  loadingTx: false,
  loadingNft: false,
  loadingMint: false,
  loadingBurn: false,
  loadingSwitch: false,
  loadingApprove: false,
  loadingSendNft: false,
  isFirstTokenApproved: false,
  transactions: null,
  nfts: [],
  zeroAddress: '',
  getNfts: () => { },
  sendNFT: (address: `0x${string}`, idToken: number, to: `0x${string}`) => { },
  approveNFT: (address: `0x${string}`, idToken: number) => { },
  getApprovedNFT: (idToken: number) => `0x${string}`,
  actionMint: (address: `0x${string}`, typeToken: string) => { },
  actionBurn: (address: `0x${string}`, typeToken: string) => { },
  switchChain: () => { },
  isGoodChain: (idChain: number | undefined): boolean => { },
  parseOwnedNFTs: (nfts: [{ from: `0x${string}`, to: `0x${string}`, tokenID: string }], owner: string) => [],
});

type Props = {
  children: React.ReactNode;
};

const apiScrollScan = {
  transactionsAddr: (address: `0x${string}`, apiKey: string) => `https://api-sepolia.scrollscan.com/api?module=account&action=tokennfttx&address=${address}&apikey=${apiKey}`,
  nftList: (address: `0x${string}`, apiKey: string) => `https://api-sepolia.scrollscan.com/api?module=account&action=tokennfttx&contractaddress=${address}&apikey=${apiKey}`,
}

export const Web3ContextProvider = (props: Props) => {
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingNft, setLoadingNft] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);
  const [loadingBurn, setLoadingBurn] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingSendNft, setLoadingSendNft] = useState(false);
  const [isFirstTokenApproved, setIsFirstTokenApproved] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const setWatcherNFT = () => {
    console.count('run set Watched');
    return publicClient.watchContractEvent({
      address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
      abi: NFT_CARD.abi,
      eventName: 'Transfer',
      onLogs: async (logs) => {
        console.log('Contract on Transfer Event, log:', logs);

        // reload nfts
        await getNfts();
      },
    });
  };

  const setWatcherApprove = () => {
    console.count('run set Watched');
    return publicClient.watchContractEvent({
      address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
      abi: NFT_CARD.abi,
      eventName: 'Approve',
      onLogs: async (logs) => {
        console.log('Contract on Approve Event, log:', logs);

        // reload approve
        if (logs && logs[0] && logs[0].args['tokenId'])
          await getApprovedNFT(parseInt(logs[0].args['tokenId']));
      },
    });
  };

  useEffect(() => {
    console.log('init - hello context');
    const unWatchNFT = setWatcherNFT();
    const unWatchApprove = setWatcherApprove();

    return () => {
      console.count('run useEffect return and unwatch Watched');
      unWatchNFT();
      unWatchApprove();
      //unWatchMint();
    };
  }, []);

  const getTransaction = async (address: `0x${string}`) => {
    console.log('getTransaction');
    try {
      setLoadingTx(true);
      const response = await fetch(apiScrollScan.transactionsAddr(address, ''));
      const responseTx = await response.json();
      setTransactions(responseTx);
      setLoadingTx(false);
      return responseTx;
    } catch (e) {
      setLoadingTx(false);
      console.log(e)
    }
  }

  const getNfts = async () => {
    console.log('getNfts');
    try {
      setLoadingMint(false);
      setLoadingSendNft(false);
      setLoadingNft(true);
      const response = await fetch(apiScrollScan.nftList(config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR, ''));
      const responseNfts = await response.json();
      if (responseNfts && responseNfts.message && responseNfts.message === "OK") {
        setNfts(responseNfts.result);
      }
      setLoadingNft(false);
      //console.log({ responseNfts });
      return responseNfts;
    } catch (e) {
      setLoadingNft(false);
      console.log(e)
    }
  }

  const actionMint = async (address: `0x${string}`, typeToken: string) => {
    try {
      setLoadingMint(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR,
        abi: NFT_CARD.abi,
        functionName: 'mint',
        args: [typeToken],
      });
      await walletClient.writeContract(request);
      //setLoadingMint(false);
    } catch (e) {
      setLoadingMint(false);
      console.log(e)
    }
  }

  const actionBurn = async (address: `0x${string}`, typeToken: string) => {
    try {
      setLoadingBurn(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
        abi: NFT_CARD.abi,
        functionName: 'burn',
        args: [typeToken, marketplace],
      });
      await walletClient.writeContract(request);
      setLoadingBurn(false);
    } catch (e) {
      setLoadingBurn(false);
      console.log(e)
    }
  }

  // Approve & Transfer NFT
  const sendNFT = async (address: `0x${string}`, idToken: number, to: `0x${string}`) => {
    try {
      console.log('sendNFT');
      setLoadingSendNft(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
        abi: NFT_CARD.abi,
        functionName: 'safeTransferFrom',
        args: [address, to, idToken],
      });
      await walletClient.writeContract(request);

      /*const results = await publicClient.multicall({
         contracts: [
           {
             address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR,
             abi: NFT_CARD.abi,
             functionName: 'approve',
             args: [address, idToken]
           },
           {
             address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR,
             abi: NFT_CARD.abi,
             functionName: 'safeTransferFrom',
             args: [address, to, idToken]
           },
         ]
       });
       console.log({ results });*/

      //setLoadingSendNft(false);
    } catch (e) {
      setLoadingSendNft(false);
      console.log('error');
      console.log(e)
    }
  }

  const approveNFT = async (address: `0x${string}`, idToken: number) => {
    try {
      console.log('approveNFT');
      setLoadingApprove(true);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
        abi: NFT_CARD.abi,
        functionName: 'approve',
        args: [address, idToken],
      });
      await walletClient.writeContract(request);

      //setLoadingApprove(false);
    } catch (e) {
      setLoadingApprove(false);
      console.log('error');
      console.log(e)
    }
  }

  const getApprovedNFT = async (idToken: number) => {
    try {
      console.log('getApprovedNFT');
      setLoadingApprove(true);
      const approved = await publicClient.readContract({
        address: config.SCROLLSEPOLIA.CONTRACT_NFT_ADDR as `0x${string}`,
        abi: NFT_CARD.abi,
        functionName: 'getApproved',
        args: [idToken]
      });
      console.log({ approved });
      console.log({ approved: approved !== zeroAddress });
      setIsFirstTokenApproved(approved !== zeroAddress);
      setLoadingApprove(false);
      return approved as `0x${string}`;
    } catch (e) {
      setLoadingApprove(false);
      console.log('error');
      console.log(e)
    }
  }

  const switchChain = async () => {
    try {
      console.log('switchChain', scrollSepolia.id);
      if (walletClient && !loadingSwitch) {
        setLoadingSwitch(true);
        await walletClient.switchChain({ id: scrollSepolia.id });
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingSwitch(false);
  }

  const isGoodChain = (idChain: number | undefined) => {
    if (idChain === undefined) return false;
    const scroll = scrollSepolia.id;
    return idChain === scroll;
  }

  const parseOwnedNFTs = (nfts: [{ from: `0x${string}`, to: `0x${string}`, tokenID: string }], owner: string) => {
    const listTokenIdsOwned = [];
    const listTokenIdsNOwned = [];
    const tokens = [];
    const reverseHistory = nfts.reverse();
    for (let index = 0; index < reverseHistory.length; index++) {
      const current = reverseHistory[index];
      if (current.to.toLocaleLowerCase() === owner.toLocaleLowerCase()
        && listTokenIdsNOwned.indexOf(current.tokenID) === -1
        && listTokenIdsOwned.indexOf(current.tokenID) === -1
      ) {
        tokens.push(current);
        listTokenIdsOwned.push(current.tokenID);
      } else if (listTokenIdsNOwned.indexOf(current.tokenID) === -1
        && listTokenIdsOwned.indexOf(current.tokenID) === -1
      ) {
        listTokenIdsNOwned.push(current.tokenID);
      }
    }
    return tokens.reverse();
  }

  return (
    <Web3Context.Provider
      value={{
        loadingTx,
        loadingNft,
        loadingMint,
        loadingBurn,
        loadingSwitch,
        loadingApprove,
        loadingSendNft,
        isFirstTokenApproved,
        transactions,
        getTransaction,
        nfts,
        getNfts,
        sendNFT,
        approveNFT,
        getApprovedNFT,
        actionMint,
        actionBurn,
        switchChain,
        isGoodChain,
        zeroAddress,
        parseOwnedNFTs,
      }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3Context;

