import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { IApi, ICustomer, IOrder, IOrderResponse, IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData, Product } from './components/AppData';
import { API_URL } from './utils/constants';
import { Page } from './components/MainPage';
import { Modal } from './components/common/Modal';
import { OrderList, ProductOrderList } from './components/common/OrderList';
import { ProductList } from './components/Product';
import { Order, Contacts, Success } from './components/common/Form';

const events = new EventEmitter();
const appModel = new AppData({}, events);

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

api
	.getProductItemList()
	.then((res) => {
		appModel.setProductItemsList(res as IProduct[]);
		console.log(appModel);
	})
	.catch((err) => console.error('Error fetching product items:', err));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const orderList = new OrderList(
	'basket',
	cloneTemplate(basketTemplate),
	events
);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

events.on('items:changed', () => {
	page.catalog = appModel.productList.map((item) => {
		const product = new ProductList(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: Product) => {
	page.locked = true;
	const product = new ProductList(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toOrderList', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			chosen: item.chosen,
		}),
	});
});

events.on('card:toOrderList', (item: Product) => {
	if (item.chosen == true) {
		modal.setDisabled(modal.content.querySelector('.card__button'), true);
	}
	appModel.toOrderList(item);
	page.counter = appModel.getItemsInOrderList();
	modal.close();
});

events.on('orderList:delete', (item: Product) => {
	appModel.outOfOrderList(item.id);
	item.chosen = false;
	orderList.price = appModel.getTotalPrice();
	page.counter = appModel.getItemsInOrderList();
	orderList.refreshCountInOrderList();
	if (!appModel.orderList.length) orderList.disableButton();
});

events.on('orderList:open', () => {
	page.locked = true;
	const orderItemList = appModel.orderList.map((item, index) => {
		const ListItem = new ProductOrderList(
			'card',
			cloneTemplate(cardBasketTemplate),
			{ onClick: () => events.emit('orderList:delete', item) }
		);
		return ListItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: orderList.render({
			list: orderItemList,
			price: appModel.getTotalPrice(),
		}),
	});
});

events.on('orderList:order', () => {
	modal.render({
		content: order.render({ address: '', valid: false, errors: [] }),
	});
});

events.on('orderFormErrors:change', (errors: Partial<ICustomer>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((error) => !!error)
		.join('; ');
});

events.on('orderInput:change', (data: { field: keyof ICustomer; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	appModel.order.total = appModel.getTotalPrice();
	appModel.setItems();
	modal.render({ content: contacts.render({ valid: false, errors: [] }) });
});

events.on('contacts:submit', () => {
	api
		.postOrderToServer(appModel.order)
		.then((res) => {
			events.emit('order:success', res);
			appModel.clearOrderList();
			appModel.refreshOrder();
			order.disableButtons();
			page.counter = 0;
			appModel.resetChosen();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:success', (res: IOrderResponse) => {
	modal.render({
		content: success.render({
			totalPrice: res.total,
		}),
	});
});

events.on('modal:close', () => {
	page.locked = false;
	appModel.refreshOrder();
});
