# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении 

Карточка

```
export interface ICard {
 _id: string;
 name: string;
 about: string;
 price: string;
 category: string;
 link: string;
}
```

Форма

```
export interface IForm {
 payment: string;
 address: string;
 mail: string;
 phone: string;
}
```

Модель для хранения данных карточек

```
export interface ICardsDate {
 cards: ICard[];
 preview: string | null;
}
```

Гланая страница с карточками

```
export type TMainPage = Pick<ICard, 'name' | 'category' | 'price' | 'link'>;
```

Корзина с выбранными карточками

```
export type TCardBasket = Pick<ICard, 'name' | 'price'>;
```

Способ оплаты и адрес доставки

```
export type TOrderInfo = Pick<IForm, 'payment' | 'address'>;
```

Данные пользователя при оформления заказа

```
export type TUserInfo = Pick<IForm, 'mail' | 'phone'>;
```