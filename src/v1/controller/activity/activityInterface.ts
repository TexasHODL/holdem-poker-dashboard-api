import { Mixed } from "mongoose";

export interface greaterLessThenType {
  $gte: number;
  $lt: number;
}

export interface queryType {
  addeddate: greaterLessThenType;
}

export interface datesPayload {
  startDate: number;
  endDate: number;
}

export interface paramsType {
  keyForRakeModules: boolean;
}

export interface resultType {
  playerCount: number;
}

export interface PlayerDataResultType {
  startDate: number;
  endDate: number;
  playerCount: number;
}

export interface findTotalChipsAddedQuery {
  status: string;
  date: greaterLessThenType;
}

export interface paramsDate {
  startDate: number;
  endDate: number;
}

export interface findUserOptsQuery {
  createdAt: greaterLessThenType;
}
