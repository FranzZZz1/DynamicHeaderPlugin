# Верстка сайта "DynamicHeaderPlugin" 
## [Предпросмотр](https://franzzzz1.github.io/DynamicHeaderPlugin/)
![Preview Image](https://github.com/FranzZZz1/DynamicHeaderPlugin/raw/main/img/preview/1.jpg)

[Перейти к файлу dh-plugin.js](dh-plugin.js)
## Примечание
Свойство "transition" для регулировки скорости открытия меню следует указать вручную, в файле CSS.

## Обновления
```diff 
+ 15\09\23 - добавлены параметры: 
```

1. $\textsf{\textbf{\color{#5576c7}headerHeightValue}}$ - параметр, который будет полезен в случае, если присвоение класса <b>headerScrollClass</b> несет за собой уменьшение высоты <b>header</b>. При перемещении по якорным ссылкам будет учитываться высота <b>header</b>, указанная в этом параметре. Принимает числовое значение. <br> Требования: <b>headerScroll: true</b>
   
2. $\textsf{\textbf{\color{#5576c7}animationClass}}$ - класс, который будет присвоен элементу header во время открытия меню. После окончания анимации открытия, класс удалится.
   
3. $\textsf{\textbf{\color{#5576c7}speed}}$ - скорость открытия меню. Указывается в миллисекундах.

