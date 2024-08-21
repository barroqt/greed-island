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
  level: number;
  title: string;
  desc: string;
  map: string;
  wifiKnow: string[];
  goalOrder: GoalObj;
  imsiHandler: boolean;
  success?: string;
  orderFix: boolean;
}

export type GoalObj = {
  [index: string]: {
    break?: boolean;
    method?: string;
    name?: string;
    optional?: boolean;
    computerScreen?: boolean;
    computerMode?: string;
    dialog?: string[];
  };
}

export type Objects = {
  [index: string]: {
    name: string;
    default: string;
  };
}
