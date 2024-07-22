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

Форма пользователя

```
export interface IUser {
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

Способ оплаты и адрес доставки пользователя

```
export type TOrderInfo = Pick<IUser, 'payment' | 'address'>;
```

Данные пользователя при оформления заказа

```
export type TUserInfo = Pick<IUser, 'mail' | 'phone'>;
```


## Архитектура приложения

Код приложения  разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь представления и данных;

## Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах end point и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, который будут переданы в JSON в теле запроса, и отправлет эти данные на end point переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработке событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` -  подписка на событие;
- `emit` - инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие;

### Слой данных

#### Класс CardsData
Класс отвечает за хранение и логику работы с данными карточек, представленных на странице.\
Конструктор класса принимает инстанг брокера событий.\
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек;
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне;
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных;

Также класс представляет набор методов для взаимодействия с этими данными.
- addCard(card: ICard): void - добавляет карточку в массив корзины;
- deleteCard(cardId: string, playload: Function | null): void - удаляет карточку из массива корзины;
- getCard(cardId: string): ICard - возвращает карточку по ее id;
- сеттеры и геттеры для сохранения и получения данных из полей класса;

#### Класс UserData
Класс отвечает за хранение данных пользователя.\
Конструктор класса принимает инстанг брокера событий.\
В полях класса хранятся следующие данные:
- payment: string - способ оплаты;
- address: string - адрес пользователя;
- mail: string - электронная почта пользователя;
- phone: string - номер телефона пользователя;
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных;

Также класс предоставляет наборов методов для взаимодействия с этими данными.
- setUserInfo(userData: IUser): void - сохраняет данные пользователя в классе;

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент), представляемых в них данных.

#### Класс Modal
Реализует модальное окно. Также предоставляет методы `open` и `close` для управления отображения модального окна. Устанавливает слушатели на клавиатуру: для закрытия модального окна по ESC, на клик по overlay, и кнопку крестик для закрытия модального онка.
- constructor(selector: string, events: IEvents) - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициализации событий.

Поля класса:
- modal: HTMLElement - элемент модального окна;
- events: IEvents - брокер событий;

#### Класс ModalForm
Расширяет класс Modal. Предназначен для реалиции модальных окон по template id. При сабмите инициирует событие передавая в него объект с данными из полей ввода форм.

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения;
- templateId: string - id формы;
- inputs: NodeListOf <HTMLInputElement> - коллекция всех полей ввода формы;

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения;
- getInputValue(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные, введенные пользователем;
- get form: HTMLElement - геттер для получения элемента формы;

#### Класс ModalWithImage
Расширяет класс Modal. Предназначен для реализации модального окна с изображением в большом размере. При открытии модального окна получает данные изображения, которое нужно показать.

Поля класса:
- imageElement: HTMLImageElement - элемент разметки с изображением;
- imageCaption: HTMLElement - элемент разметки для вывода данных изображения;

Методы:
- open(data: { name: string, link: string }): void - расширение родительского метода, принимает данные изображения, которые используются для заполнения атрибутов элементов;
- close(): void - закрытие модального окна;

#### Класс Card
Отвечает за отображение карточки, задавая в карточки даные: названия, изображения, стоиомость, описание, категорию. Класс используется для отображения карточек на стрнице сайта. В конструктор класса передается DOM элемент тимплейта, что позволяет при необходимости формироввать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми польователя генерируются соответствующие события.\
Поля класса содержать элементы разметки элементов карточки. Конструктор, кроме тимплейта принимает экземлпяр `EventEmitter` для инициации событий.\

Методы:
- setData(cardData: ICard): void - заполняет атрибуты элементов карточки данными.
- deleteCatd(): void - метод удаления карточки;
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями;
- геттер id возвращает уникальный id карточки;

#### Класс CardsContainer
Отвечает за отображение карточек на главной странице. Предоставляет сеттер `container` для предоставления карточек.


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкэндом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющим роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируется классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения модального окна
- `card:delete` - выбор карточки для удаления
- `card:submit` - сохранение выбранных карточек в корзине
- `order:input` - внесение данных в форме заказе
- `order:submit` - сохранение заказа в модальном окне
- `contacts:input` - внесение данных в форме контактов
- `contacts: submit` - сохранение контактов в модальном окне

 