export interface Suchkriterium {
  key: string;
  value: string;
}

export type LoginDaten = {
  username: string;
  password: string;
};

export type Token = {
    access_token: string;
    refresh_token: string;
};
