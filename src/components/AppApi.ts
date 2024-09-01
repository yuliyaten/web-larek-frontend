import { IApi, IProduct } from '../types';

// Тип для отправки заказа на сервер
export type OrderRequest = {
	total: number;
	items: string[];
};

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProductItemList() {
		return this._baseApi.get<{total: number, items: IProduct[]}>('/product')
		.then((res: {total: number, items: IProduct[]}) => res.items)
}

postOrderToServer(order:OrderRequest){
		return this._baseApi.post<OrderRequest>('/order', order,'POST')
		.then((res) => res)
}
}
