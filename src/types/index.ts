export interface ICard {
 _id: string;
 name: string;
 about: string;
 price: string;
 category: string;
 link: string;
}

export interface IForm {
 payment: string;
 address: string;
 mail: string;
 phone: string;
}

export interface ICardsDate {
 cards: ICard[];
 preview: string | null;
}

export type TMainPage = Pick<ICard, 'name' | 'category' | 'price' | 'link'>;

export type TCardBasket = Pick<ICard, 'name' | 'price'>;

export type TOrderInfo = Pick<IForm, 'payment' | 'address'>;

export type TUserInfo = Pick<IForm, 'mail' | 'phone'>;
