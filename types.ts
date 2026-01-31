
export interface Participant {
  id: string;
  name: string;
}

export interface Winner {
  id: string;
  name: string;
  prize?: string;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppMode {
  MANAGE = 'MANAGE',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}
