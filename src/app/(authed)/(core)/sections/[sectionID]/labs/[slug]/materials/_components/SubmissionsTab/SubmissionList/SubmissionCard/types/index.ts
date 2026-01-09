export interface IBaseCard {
  order: number;
  onClick?: () => void;
}

export interface IPassedCard extends IBaseCard {
  totalCase: number;
}

export interface IFailedCard extends IBaseCard {
  correctCase: number;
  totalCase: number;
}
