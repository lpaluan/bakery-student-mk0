import { Timestamp } from "rxjs";

export interface Imatch {
  created_at: string;
  id: string;
  opponent: string;
  matchdatetime: string;
}

export interface IteamMatchGrouped {
  team: string;
  opponent: string;
  matchmonth: string;
  presencecount: number;
}

export interface IteamMatchMonthGrouped {
  team: string;
  matchmonth: string;
  presencecount: number;
  matches: IteamMatchGrouped[];
}
