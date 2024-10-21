const config = {
  subDomain: "/",
  api: "http://localhost:3000/api",
  version: "0.0.1",
  debug: false,
  README: 'https://github.com/barroqt/greed-island',
  SCROLLSEPOLIA: {
    "CHAIN_ID": 534351,
    "RPC": "https://sepolia-rpc.scroll.io/",
    "NATIVE_DECIMAL": '18',
    "STABLE_DECIMAL": '6',
    "CONTRACT_NFT_ADDR": "0x4B5F89af12939CD02C36e806ab3568c5Fe3006fD",
    //"CONTRACT_NATIVE_COIN": "",
  },
  game: {
    name: 'GreedIsland',
    quests: {
      'INIT871': {
        title: 'Quest 1',
        desc: 'Follow the instructions to successfully complete the in-game check-in',
        map: 'WelcomeScene',
        web2connected: true,
        web3connected: true,
        inventoryLength: 1,
        inventoryContents: ['006'],
        orderFix: true,
        goalOrder: {
          'WelcomeScene': {
            'id1': {
              dialogs: [
                'Welcome to Greed Island. A game without coherence or benevolence, where only the miserable experience of your failures reigns.',
                'Just kidding... or not ?',
                'Well, first of all please, connect a web3 wallet to this interface.',
                { action: 'connect-wallet', message: 'Waiting user to connect a wallet...', link: 'README1.txt' },
                'Perfect, we finally can talk as educated person.',
                'Would you like to choose between this two beauty ?',
                { action: 'choose-text', messages: ['Red', 'Blue'], message: 'Make a choice' },
                { action: 'mint-wallet', message: 'Waiting user to mint...', link: 'README2.txt' },
                'Hopla, you\'re finally ready to play with brutal animals such as you are.',
              ],
            },
          }
        },
        success: {
          action: 'teleport',
          destination: 'UniversityScene',
          message: 'You received an NFT, you are now ready to explore the world.',
        },
      },
    },
    objects: {
      'OverWorldScene': {
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
      'SoftwareScene': {
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
      },
      'WelcomeScene': {
        id1: {
          name: 'Razor',
          default: 'What\'s up today ?',
          quests: ['INIT871'],
        },
      }
    },
    defaultPlayer: {
      quests: ['INIT871'],
    },
  },
};

export const apiServer = {
  playerGet: { url: config.api + "/players/:id", method: "GET" },
  playerAddressGet: { url: config.api + "/players/address/:address", method: "GET" },
  playerCreate: { url: config.api + "/players", method: "POST" },
  playerUpdate: { url: config.api + "/players/:id", method: "PUT" },
  playerDelete: { url: config.api + "/players/:id", method: "DELETE" },
  playerAddInv: { url: config.api + "/players/:id/inventory", method: "POST" },
  playerRmInv: { url: config.api + "/players/:id/inventory/:itemId", method: "DELETE" },
  questGet: { url: config.api + "/quests/:id", method: "GET" },
  questGetByPlayer: { url: config.api + "/quests/player/:id", method: "GET" },
  questCreate: { url: config.api + "/quests", method: "POST" },
  questUpdate: { url: config.api + "/quests/:id", method: "PUT" },
  questDelete: { url: config.api + "/quests/:id", method: "DELETE" },
  questComplete: { url: config.api + "/quests/:id/complete", method: "POST" },
  itemGet: { url: config.api + "/items/:id", method: "GET" },
  itemGetByType: { url: config.api + "/items/type/:id", method: "GET" },
  itemCreate: { url: config.api + "/items", method: "POST" },
  itemUpdate: { url: config.api + "/items/:id", method: "PUT" },
  itemDelete: { url: config.api + "/items/:id", method: "DELETE" },
};

export default config;