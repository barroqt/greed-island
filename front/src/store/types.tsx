export type User = {
  name: string;
  level: number;
  newLevel: boolean;
  loadingLevel: boolean;
}

export type Quests = {
  [index: string]: Quest;
}

export type Quest = {
  //level: number;
  title: string;
  desc: string;
  map: string;
  web2connected: boolean;
  web3connected: boolean;
  inventoryLength: number;
  inventoryContents: string[];
  orderFix: boolean;
  goalOrder: { [map: string]: GoalObj };
  success?: {
    action?: string;
    destination?: string;
    message: string;
  };
}

export type GoalObj = {
  [idObj: string]: {
    dialogs?: [string | GoalLine];
  };
}

export type GoalLine = { action: string; message: string; messages?: [string]; link?: string; };

export type Objects = {
  [map: string]: {
    [index: string]: {
      name: string;
      default: string;
      quests?: [string];
    };
  };
}

export type PlayerPos = {
  x: number;
  y: number;
  map: string;
};

export type Multiplayers = { [key: string]: PlayerPos };
export type WebSocketContext = {
  playerName: string;
  setPlayerName: Function;
  multiplayers: Multiplayers;
  sendMove: Function;
}

export type Web2Context = {
  user: Player | null;
  inventory: InventoryItem | null;
  loadingUser: boolean;
  getUser: Function;
  addUserAction: Function;
}

export type Player = {
  name: string;
  address: string;
  quests: string[];
  questsDone: string[];
  actions: string[];
}

export type InventoryItem = {
  id: string;
  itemId: string;
  quantity: number;
  playerId: string;
}