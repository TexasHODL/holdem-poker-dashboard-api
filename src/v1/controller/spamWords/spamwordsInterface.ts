export interface arrayPayload {
  [text: string]: string;
}

export interface blockedWordsPayload {
  blockedWords: arrayPayload[];
}

export interface spamWordPayload {
  blockedWordsList: blockedWordsPayload | {};
  blockedWords: string[];
}

export interface ParamsType {
  blockedWords: [];
}
