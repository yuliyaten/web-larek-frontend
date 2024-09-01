import { Product } from '../components/AppData';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	chosen: boolean;
}

export interface IOrder {
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: string;
	total: number;
}

export interface ICustomer {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export type TProductInfo = Pick<IProduct,'id'|'title' | 'description' | 'image' | 'category' | 'price' | 'chosen'>;

export type TOrder = Pick<IOrder, 'address' | 'payment'>;

export type TOrderContacts = Pick<ICustomer, 'email' | 'phone' | 'payment' | 'address'>;

export type FormErrors = Partial<Record<keyof ICustomer, string>>

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface IAppData {
	productItemList: Product[];
	order: IOrder;
	basket: Product[];
	formErrors: FormErrors;
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductList {
	list: HTMLElement[];
	price: number;
}

export interface ISuccess {
 totalPrice: number
}

export interface ISuccessActions {
	onClick: () => void;
}
