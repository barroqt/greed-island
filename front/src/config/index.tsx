const config = {
  subDomain: "/",
  api: "http://127.0.0.1:3002/v1",
  SCROLLSEPOLIA: {
    "CHAIN_ID": 534351,
    "RPC": "https://sepolia-rpc.scroll.io/",
    "NATIVE_DECIMAL": '18',
    "STABLE_DECIMAL": '6',
    "CONTRACT_NFT_ADDR": "0x2dAD38Ef358CCF21866D65b0d66D2adE674E5f04",
    "CONTRACT_NATIVE_COIN": "0x8F108E9D0b798B52a5b52B8CF1DDf75447Fb03B4",
  },
  version: '0.0.1',
  debug: false,
  README: 'https://github.com/barroqt/greed-island',
  game: {
    name: 'GreedIsland',
    quests: {
      ERGBHJ98: {
        level: 1,
        title: 'Quest 1',
        desc: 'Find a way to get an NFT. If you don\'t know what it is, maybe some villagers can help you!.',
        map: '',
        wifiKnow: [],
        orderFix: false,
        imsiHandler: false,
        goalOrder: {
          id3: { optional: true, break: true, dialog: ['Welcome to my city! Do you need some help ?', 'Oh, NFTs ? It\'s just special kind of cryptoasset in which each token is unique', 'You can have them in your phone!'] },
          web3: { method: 'mint' },
        },
        success: 'You received an NFT.',
      },
      OPJSBE9U: {
        level: 2,
        title: 'Quest 2',
        desc: 'Now that you have NFTs, you\'ll need to learn how to share them. To do this, find another player to whom you can send your NFT.',
        map: '',
        wifiKnow: [],
        orderFix: false,
        imsiHandler: false,
        goalOrder: {
          id3: { optional: true, break: true, dialog: ['What\'s up ?', 'Ah, you need to transfer a NFT ?', 'Well, you will need to ask a friend to join you here !'] },
          web3: { method: 'transfer' },
        },
        success: 'You have successfully completed your first transaction.'
      },
    },
    objects: {
      id1: {
        name: '',
        default: '"Et puisse l\'avenir ne pas nous le reprocher par un chagrin", it looks like French literature...',
      },
      id2: {
        name: '',
        default: 'Greed Island is a very quiet, peaceful and relaxing place to enjoy the good weather and the spring wind...',
      },
      id3: {
        name: 'Roger',
        default: 'What\'s up today ?',
      },
      id4: {
        name: '',
        default: 'Greed Island is populated by 10 wonderful people. We are happy to count you among us.',
      },
      id5: {
        name: '',
        default: 'Search House Lab, a place to learn cybersecurity.',
      },
      id6: {
        name: 'Bob',
        default: '♪ Well you give me the blues ♫',
      },
      id7: {
        name: 'Jest',
        default: 'I can\'t wait to explore the outdoors with my droids.',
      },
      id8: {
        name: 'Anna',
        default: 'My current job is to breach cryptographic security systems and gain access to the contents of encrypted messages.',
      },
      id9: {
        name: 'Software Engineer',
        default: 'Do you know what is an IP ? It\'s an numerical label that uses the Internet Protocol for communication. For example 192.168.50.1 can be the address of the router in a local network.',
      },
      id10: {
        name: 'Professor H',
        default: 'It\'s a beautiful day to hack, isn\'t it ?',
      },
      id11: {
        name: 'Kev',
        default: 'Do you know what is an IMSI-catcher ? It\'s a device used for intercepting mobile phone traffic and tracking location data of users. It\'s working like a MITM attack but for an entire zone.',
      },
      id12: { //dashboard
        name: '',
        default: '',
      },
      id13: { // server 1
        name: '',
        default: '',
      },
      id14: {// server2
        name: '',
        default: 'Look like it\'s doing some serious math',
      },
      id15: {
        name: '',
        default: 'This computer seems to be off.',
      },
      id16: {
        name: '',
        default: 'Trash is empty.',
      },
      id17: {
        name: 'Server',
        default: 'Hi, my name is Miaws',
      },
      id18: { // server 4
        name: '',
        default: '',
      },
      id19: { //softwarescene_computer2
        name: '',
        default: '',
      },
      id20: { // lampadere
        name: 'Lampada',
        default: 'I\'m just a light you know...',
      },
      id21: {
        name: '',
        default: 'It\'s closed. You can\'t walk into people\'s houses like that!',
      },
      id22: {// droid outside
        name: 'Droid',
        default: 'Civil liberty and privacy concerns are such a human concept...',
      },
    },
  },
};

export const apiServer = {};

export default config;