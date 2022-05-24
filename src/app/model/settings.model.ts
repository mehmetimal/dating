export interface ISettings {
  _id?: string;
  detailsText?: string;
  memberShipText?: string;
  mailText?: string;
  systemTextFirst?: string;
  systemTextSecond?: string;
}

export class Settings implements ISettings {
  constructor(
    public _id?: string,
    public detailsText?: string,
    public memberShipText?: string,
    public mailText?: string,
    public systemTextFirst?: string,
    public systemTextSecond?: string
  ) {
  }
}
