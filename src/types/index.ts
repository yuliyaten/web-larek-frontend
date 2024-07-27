export interface ICard {
 _id: string;
 name: string;
 about: string;
 price: string;
 category: string;
 link: string;
}

export interface IOrderFormData {
 deliveryPayment: {
  payment: string;
  address: string;
 };
 contactInfo: {
  mail: string;
  phone: string;
 };
}

export interface ICardsDate {
 cards: ICard[];
 preview: string | null;
 addCard(card: ICard): void;
 deleteCard(cardId: string, playload: Function | null): void;
 getCard(cardId: string): ICard;
}

export type TMainPage = Pick<ICard, 'name' | 'category' | 'price' | 'link'>;

export type TCardBasket = Pick<ICard, 'name' | 'price'>;

export type TOrderInfo = Pick<IOrderFormData['deliveryPayment'], 'payment' | 'address'>;

export type TUserInfo = Pick<IOrderFormData['contactInfo'], 'mail' | 'phone'>;
