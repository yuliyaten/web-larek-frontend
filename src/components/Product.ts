import { category, CategoryType, ICardActions, TProductInfo } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { CDN_URL } from "../utils/constants";

export class ProductView extends Component<TProductInfo> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  
  constructor(protected blockName: string, protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._button = container.querySelector(`.${blockName}__button`);
    
    if (actions?.onClick) {
      if (this._button) {
        this._button.innerHTML = "Добавить в заказ";
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }
  
  set id(value: string) {
    this.container.dataset.id = value;
  }
  
  get id(): string {
    return this.container.dataset.id || '';
  }
  
  set image(value: string) {
    this._image.src = CDN_URL + value
  }
  
  set title(value: string) {
    this.setText(this._title, value);
  }
  
  get title(): string {
    return this._title.textContent || '';
  }
  
  set category(value: CategoryType) {
    this._category.textContent = value
    this._category.classList.add(category[value])
  }

  set chosen(value: boolean) {if (!this._button.disabled) {this._button.disabled = value}}

  disableButton() {this._button.disabled = true}
  
  set price(value: string) {
    if (value !== undefined && this._price) {
      this.setText(this._price, `${value} синапсов`);
    }
  }
}

export class ProductList extends ProductView {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?:ICardActions) {
    super('card', container, actions)
    this._description = container.querySelector(`.${this.blockName}__text`)
  }
  set description(value: string) {this._description.textContent = value}
}

