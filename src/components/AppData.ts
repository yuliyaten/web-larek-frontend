import { FormErrors, IAppData, ICustomer, IOrder, IProduct } from "../types";
import { Model } from "./base/model";

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	chosen: boolean;
}

export class AppData extends Model<IAppData> {
	orderList: Product[] = [];
	productList: Product[];
	order: IOrder = {
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
	};

	formErrors: FormErrors = {};

	toOrderList(value: Product) {
		this.orderList.push(value);
	}

	outOfOrderList(id: string) {
		this.orderList = this.orderList.filter((item) => item.id !== id);
	}

	clearOrderList() {
		this.orderList.length = 0;
	}

	getItemsInOrderList() {
		return this.orderList.length;
	}

	getTotalPrice() {
		return this.orderList.reduce(
			(sum: number, next) => sum + next.price, 0);
	}

	setItems() {
		this.order.items = this.orderList.map((item) => item.id);
	}

	setOrderField(field: keyof ICustomer, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order)
	}
	if (this.validateOrder()) {
			this.events.emit('order:ready', this.order)
	}
}

validateContacts() {
	const errors: typeof this.formErrors = {}
	if (!this.order.email) {errors.email = 'Укажите email'}
	if (!this.order.phone) {errors.phone = 'Укажите номер телефона'}
	this.formErrors = errors
	this.events.emit('contactsFormErrors:change', this.formErrors)
	return Object.keys(errors).length === 0
}

validateOrder() {
	const errors: typeof this.formErrors = {}
	if (!this.order.address) {errors.address = 'Укажите адрес'}
	if (!this.order.payment) {errors.payment = 'Укажите способ оплаты'}
	this.formErrors = errors
	this.events.emit('orderFormErrors:change', this.formErrors)
	return Object.keys(errors).length === 0
}

	refreshOrder() {
		this.order = {
			items: [],
			address: '',
			email: '',
			phone: '',
			payment: '',
			total: null,
		};
	}

	setProductItemsList(items: IProduct[]) {
		this.productList = items.map((item) => new Product({ ...item, chosen: false }, this.events))
		this.emitChanges('items:changed', { productItemList: this.productList })
}
		resetChosen() {this.productList.forEach(item => item.chosen = false)}
}

