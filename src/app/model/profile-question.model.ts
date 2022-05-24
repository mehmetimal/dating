export interface IProfileQuestion {
  _id?: number;
  name?: string;
  typeId?: number;
}

export class ProfileQuestion implements IProfileQuestion {
  constructor(
    public _id?: number,
    public name?: string,
    public typeId?: number
  ) {
  }
}
