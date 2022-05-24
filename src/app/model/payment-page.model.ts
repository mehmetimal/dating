export interface IPaymentPage {
  _id?: string;
  confirmText?: string;
  buyButtonText?: string;
  pageTitle?: string;
  explanation?: string;
}

export class PaymentPage implements IPaymentPage {
  constructor(
    public _id?: string,
    public confirmText?: string,
    public buyButtonText?: string,
    public pageTitle?: string,
    public explanation?: string
  ) {
  }
}
