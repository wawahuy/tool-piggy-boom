export interface UserGoldDetailResponse {
  first: number;
  island: {
    [key: string]: {
      level: string;
      gold: number;
    };
  };
  curGold: number;
  maxGold: number;
  total: number;
  ret: number;
  starLimit: number;
}

export interface UserGoldHarvestResponse {
  money: number;
  tili: string;
  ret: number;
}
