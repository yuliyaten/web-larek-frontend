import { FormErrors, IAppData, ICustomer, IOrder, IProduct } from '../types';
import { Model } from './base/model';

export class AppData extends Model<IAppData> {
	orderList: IProduct[] = [];
	productList: IProduct[];
	order: IOrder = {
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
	};

	formErrors: FormErrors = {};

	toOrderList(item: IProduct) {
		const orderItem = { ...item, orderId: Date.now() }; 
		this.orderList.push(orderItem);
	}

	outOfOrderList(id: string) {
		this.orderList = this.orderList.filter((item) => item.id !== id);
	}

	clearOrderList() {
		this.orderList = [];
	}

	getItemsInOrderList() {
		return this.orderList.length;
	}

	getTotalPrice() {
		return this.orderList.reduce((sum: number, next) => sum + next.price, 0);
	}

	setOrderItemsId() {
		this.order.items = this.orderList.map((item) => item.id);
	}

	setOrderField(field: keyof ICustomer, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
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
		this.productList = items.map((item) => ({ ...item, chosen: false }));
		this.emitChanges('items:changed', { productItemList: this.productList });
	}

	resetChosen() {
		this.productList.forEach((item) => (item.chosen = false));
	}
}