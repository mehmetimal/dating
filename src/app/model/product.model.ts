export interface IProduct {
  _id?: string;
  name?: string;
  price?: number;
  productImage?: string;
}

export class Product implements IProduct {
  constructor(
    public _id?: string,
    public name?: string,
    public price?: number,
    public productImage?: string
  ) {
  }
}
