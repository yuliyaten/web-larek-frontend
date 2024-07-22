export interface ICard {
 _id: string;
 name: string;
 about: string;
 price: string;
 category: string;
 link: string;
}

export interface IUser {
 payment: string;
 address: string;
 mail: string;
 phone: string;
}

export interface ICardsDate {
 cards: ICard[];
 preview: string | null;
 addCard(card: ICard): void;
 deleteCard(cardId: string, playload: Function | null): void;
 getCard(cardId: string): ICard;
}

export interface IUserData {
 setUserInfo(userData: IUser): void;
}

export type TMainPage = Pick<ICard, 'name' | 'category' | 'price' | 'link'>;

export type TCardBasket = Pick<ICard, 'name' | 'price'>;

export type TOrderInfo = Pick<IUser, 'payment' | 'address'>;

export type TUserInfo = Pick<IUser, 'mail' | 'phone'>;
