`use strict`;

// field_own,field_opponent - двумерный массив игрока1 и игрока2, содержащий значение ячеек (1 - поле пустое; 2 - поле рядом с кораблем; 3 - поле с кораблем; (-3 поле с раненым кораблем)).
// shipsOwn, shipsOpponent - массив, содержащий положение ячеек кораблей игрока1 и игрока2 соответственно.
// availableFields - ячейки, по которым бот может стрелять.
// memberPositions - ячейки, по которым бот попал в корабль, но еще не убил.
// pushCells - ячейки, по которым мы не можем стрелять (либо в это поле стреляли, либо поля рядом с убитым кораблем).
// name1, name2 - имя игрока1 и игрока2 соответственно.
// currentGamer - очередь хода (1 - ходит игрок1; 2 - ходит игрок2).
// myDestroyedShips,opponentDestroyedShips - количество убитых кораблей игрока1 и игрока2 соответственно.
// numberGame - количество сыгранных игр.
// number - размер поля.
let field_own = [],
	field_opponent = [],
	shipsOwn = [],
	shipsOpponent = [],
	availableFields = [],
	memberPositions = [],
	pushCells = [],
	name1 = '',
	name2 = '',
	currentGamer = 1,
	myDestroyedShips = 0,
	opponentDestroyedShips = 0,
	numberGame = 0,
	number = 10;




startApp();
/**
 * Устанавливает положение кораблей игрока1
 * Устанавливает обработчик на изменения положений кораблей и на кнопку начала игры
 */
function startApp(){
	changeLocation();
	addClick('.form .form__change', changeLocation);
	addClick('.form .form__start', startGame);
}

/**
 * Устанавливает положение кораблей
 */
function changeLocation(){
	//Очищает поле 
	document.querySelectorAll('.game__own .field__cell').forEach(cell => {
		cell.innerHTML = '';
		cell.className = 'field__cell';
	});
	//Заполняет массив свободными полями 
	for (let i = 0; i < number; i++){
		field_own[i] = [];
		for (let j = 0; j < number; j++){
			field_own[i][j] = 1;
		}
	}
	//Длины кораблей, которые необходимо расставить
	let ships = [4,3,3,2,2,2,1,1,1,1];
	shipsOwn = [];
	//Расставляет корабли в массив field_own
	for (let i = 0; i < ships.length; i++){
		field_own = ranking(field_own, ships[i], 1);
	}
}


/**
 * Расставляет корабль длинной line в поле field и возвращает изменненое поле field
 * @param {field} - двумерный массив игрока, который может содержать уже положение кораблей, поставленных ранее
 * @param {line} - длина корабля
 * @param {chooseField} - в зависимости от поле игрок1/игрока2 выполняет дополнительные действия
 * @description cell - рандомная ячейка, position - рандомная позиция корабля (0 - горизонтально; 1 - вертикально)
 * @description column - столбец ячейки, row - строка ячейки, rightPosition - удовлетворяет ли позиция, tempShips - массив, содержащий положение ячеек корабля
 */
function ranking(field, line, chooseField){
	//Пока не заполнит корабль
	while(true){
		
		let cell = Math.floor(Math.random() * number*number),
			position = Math.floor(Math.random() * 2),
			column = Math.trunc(cell / number),
			row = cell % number,
			rightPosition = true,
			tempShips = [];

		//Горизонтальное положение
		if (position === 0) {
			//Если поле не удовлетворяет, то меняет рандомную ячейку 
			for (let i = 0; i < line; i++){
				if (typeof(field[column][row+i]) === "undefined" || field[column][row+i] === 2 || field[column][row+i] === 3){
					rightPosition = false;
					break;
				}
			}
			//Если удовлетворяет, то заносит в shipsOwn/shipsOpponent
			if (rightPosition === true) {
				for (let i = 0; i < line; i++){
					field[column][row+i] = 3;
					tempShips.push(row + i, column);
				}
				field = createBorder(field, column,row,position,line);
				if (chooseField === 1) {
					shipsOwn.push(tempShips);
					//Если поле игрока1, то выводит корабль на экран
					renderShip(cell, position, line);
				}else{
					shipsOpponent.push(tempShips);
				}
				break;
			}
		}else{ 
		//Вертикальное положение
			for (let i = 0; i < line; i++){
				if (typeof(field[column+i]) === "undefined" || field[column+i][row] === 2 || field[column+i][row] === 3) {
					rightPosition = false;
					break;
				}
			}
			if (rightPosition === true) {
				for (let i = 0; i < line; i++){
					field[column+i][row] = 3;
					tempShips.push(row, column + i);
				}
				field = createBorder(field, column,row,position,line);
				if (chooseField === 1) {
					//Если поле игрока1, то выводит корабль на экран
					renderShip(cell, position, line);
					shipsOwn.push(tempShips);
				}
				if (chooseField === 2) {
					shipsOpponent.push(tempShips);
				}
				break;
			}
		}
	}
	return field;
}

/**
 * Отрисовывает корабль на поле игрока1
 * @param {cell} - начальная ячейка
 * @param {position} - 0 - горизонтальная отрисовка; 1 - вертикальная отрисовка
 * @param {line} - ширина или высота корабля в ячейках
 */
function renderShip(cell, position, line){
	let fieldCell = document.querySelectorAll('.game__own .field__cell');	
	let ship = document.createElement('div');
	let width = (position === 0) ? 35*line + 2 : 37;
	let height = (position === 1) ? 35*line + 2 : 37;
	
	ship.className = 'ship';
	ship.style.width = width + 'px';
	ship.style.height = height + 'px';
	fieldCell[cell].append(ship);
}

/**
 * Запускает игру
 */
function startGame(){
	message();
	name1 = document.querySelector('.form__input_own').value;
	name2 = document.querySelector('.form__input_opponent').value;
	
	if (!/^[A-zА-я0-9]{3,30}$/i.test(name1) ) {
		message('Ваше имя должно состоять из букв латинского или русского языка длиной от 3 до 30 символов');
		return;
	}
	if (!/^[A-zА-я0-9]{3,30}$/i.test(name2) ) {
		message('Имя компьютера должно состоять из букв латинского или русского языка длиной от 3 до 30 символов');
		return;
	}

	name1 = name1[0].toUpperCase() + name1.slice(1);
	name2 = name2[0].toUpperCase() + name2.slice(1);
	// Скрывает настройки
	document.querySelector('.game .game__setting').classList.add('game__setting_none');
	// Создает титульник с именами name1 и name2
	createTitle(name1, name2);
	// Создает второе поле
	createFieldOpponent();
	// Добавляет клик по полю игрока2
	addClick('.game__opponent .field__container', clickController);
	// Создает корабли игрока2
	createShipsOpponent();
	// Определяет, кто начинает ходить первым
	if (numberGame % 2 === 0) {
		currentGamer = 1;
		message('Вы начинаете игру');
	}else{
		currentGamer = 2;
		message(name2 + ' начинает игру');
	}
	//текущий ход
	currentStep();	
}

/**
 * Создает титульник, если его нет
 * @param {name1} - имя игрока1
 * @param {name1} - имя игрока2
 */
function createTitle(name1, name2){
	if (document.querySelector('.score div')) {
		return;
	}
	document.querySelector('.score').innerHTML = `
		<div class="score__own show_left" title="${name1}">${name1}</div>
		<div class="score__result">
			<span class="score__number">0</span>
			<span>:</span>
			<span class="score__number">0</span>
		</div>
		<div class="score__opponent show_right" title="${name2}">${name2}</div> 
	`;
}


/**
 * Создает поле игрока2 и добавляет в DOM
 */
function createFieldOpponent(){
	let game__opponent = document.createElement('div'),
		field__word =  document.createElement('div'),
		field__container = document.createElement('div'),
		field__numbers = document.createElement('div'),
		cell = '';

	game__opponent.className = 'game__opponent show_right';
	field__word.className = 'words field__word';
	field__container.className = 'field__container';
	field__numbers.className = 'numbers field__numbers';

	let word = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
	for (let i = 0; i < 10; i++){
		cell += `<div class="words__cell">${word[i]}</div>`;
	}
	field__word.innerHTML = cell;
	cell = ''; 	
	for (let i = 0; i < 100; i++){
		cell += `<div class="field__cell"></div>`;
	}
	field__container.innerHTML = cell;
	cell = '';
	for (let i = 0; i < 10; i++){
		cell += `<div class="numbers__cell">${i+1}</div>`;
	}
	field__numbers.innerHTML = cell;

	game__opponent.innerHTML = '<div class="field"></div>';
	game__opponent.querySelector('.field').append(field__word, field__container, field__numbers);
	document.querySelector('.game, .game__opponent').append(game__opponent);
}

/**
 * Создает корабли игрока2 (аналогично игрока1)
 */
function createShipsOpponent(){
	field_opponent = [];
	shipsOpponent = [];
	for (let i = 0; i < number; i++){
		field_opponent[i] = [];
		for (let j = 0; j < number; j++){
			field_opponent[i][j] = 1;
		}
	}
	for (let i = 0; i < number*number; i++){
		availableFields[i] = i;
	}
	let ships = [4,3,3,2,2,2,1,1,1,1];
	for (let i = 0; i < ships.length; i++){
		field_opponent = ranking(field_opponent, ships[i], 2);
	}
}

/**
 * Если очередь игрока 2, то вызывает бота
 */
function currentStep(){
	if (currentGamer === -1 ) {
		return;
	}
	if (currentGamer === 2){
		setTimeout(bot,1000);
	}
}

/**
 * Вывод сообщения статуса игры или ошибок
 */
function message(text = ''){
	document.querySelector('.message').innerText = text;
}



/**
 * Определяет позицию нажатой ячейки
 */
function clickController(event){
	let cell = event.target;
	if (currentGamer !== 1 || !cell || !cell.classList.contains('field__cell')) {
		return;
	}
	
	let position = 0;
	while (cell.previousSibling) {
	    cell = cell.previousSibling;
	    if ( cell.nodeType === 1) {
	        position++;
	    }   
	}
	// Если такой позиции нет в массиве запрещенных ячеек, то вызываем звук выстрела и проверяем попали по кораблю или нет
	if (pushCells.indexOf(position) === -1) {
		pushCells.push(position);
		audioExplosion();
		checking(position);
	}
}


/**
 * Проверка нажатой ячейки 
 * @param {position} - позиция ячейки
 */
function checking(position){
	let y = Math.trunc(position / number),
		x = position % number;
	let fieldCell = document.querySelectorAll('.game__opponent .field__cell');
	// Если ячейка без корабля, то пишем промах и вызываем игрока2
	if (field_opponent[y][x] === 1 || field_opponent[y][x] === 2) {
		fieldCell[position].innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="muff" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" xml:space="preserve"><g><circle cx="15" cy="15" r="15"/></g></svg>';
		currentGamer = 2;
		message('Вы промазали. Ходит ' + name2);
		currentStep();
		return;
	}
	// Если игрок1 попал, то у ячейки меняется знак и определяет состояние корябля
	if (field_opponent[y][x] === 3) {
		field_opponent[y][x] = -3;
		for (let i = 0; i < shipsOpponent.length; i++){
			for (let j = 0; j < shipsOpponent[i].length - 1; j += 2){
				if (shipsOpponent[i][j] === x && shipsOpponent[i][j+1] === y) {
					shipsOpponent[i][j] = x.toString();
					shipsOpponent[i][j+1] = y.toString();
					determineStateShip(shipsOpponent[i], x, y, 1, fieldCell);
					return;
				}
			}
		}
	}
}

/**
 * Определяет состояние раненого корабля
 * @param {ships} - массив ячеек, содержащий координаты корабля
 * @param {x,y} - координаты, в которые был произведен выстрел
 * @param {chooseField} - действие на поле игрока 1 или 2
 * @param {fieldCell} поле на котором идет проверка
 */
function determineStateShip(ships,x,y,chooseField,fieldCell){
	let destroyShip = true,
		position = 10*y + x;
	//Если в массиве ячеек, есть числа, то значит не все поля были застрелены
	for (let i = 0; i < ships.length; i++){
		if (typeof(ships[i]) === 'number') {
			destroyShip = false;
			break;
		}
	}
	fieldCell[position].innerHTML += '<div class="pinpoint"></div>';
	//Если корабль был убит
	if (destroyShip === true) {
		renderChangeState(ships, fieldCell, chooseField);
		if (chooseField === 2) {
			//Если убил игрок 2, то очищаем массив, по которым бот попадал в корабль.
			memberPositions = [];
			myDestroyedShips++;	
			message(name2 + ' убил ваш корабль. Ходит ' + name2);
			
		}else{
			opponentDestroyedShips++;
			message('Вы убили корабль. Ходит ' + name1);
		}
		//Проверяет конец игры
		checkGameOver();
	}else{
		if (chooseField === 2) {
			//Если игрок2 ранил, то запоминает эту ячейку 
			memberPositions.push({y: y, x: x});
			message(name2 + ' ранил ваш корабль. Ходит ' + name2);
		}else{
			message('Вы ранили корабль. Ходит ' + name1);
		}
	}
}

/**
 * Отрисовывает убитый корабль и границы на поле
 * @param {ships} - массив ячеек, содержащий координаты корабля
 * @param {cells} - ячейка, на котором отрисовывается убитый корабль
 * @param {chooseField} - действие на поле игрока 1 или 2
 */
function renderChangeState(ships,cells,chooseField){
	for (let index = 0; index < ships.length; index += 2){
		let x = Number(ships[index]);
		let y = Number(ships[index+1]);
		// Проходимся вокруг ячеек 
		for (let i = -1; i <= 1 ;i++){
			for (let j = -1; j <= 1; j++){
				if (x+i >= 0 && x+i < number && y+j >= 0 && y+j < number){
					let boderPosition = 10*(y+j) + (x+i); 
					if (chooseField === 1) {
						//Если позиции вокруг ячейки не заносили в массив pushCells, то заносим 
						if (pushCells.indexOf(boderPosition) === -1) {
							pushCells.push(boderPosition);
						}
						//Если позиция вокруг ячейки является кораблем, то отрисовываем убитый корабль
						//Иначе отрисовываем границу
						if (field_opponent[y+j][x+i] !== -3) {
							cells[boderPosition].innerHTML += '<div class="forbidden"></div>';
						}else{
							cells[boderPosition].classList.add('field__cell_border');
						}
					}else{
						//Удаляет ячейку из возможных вариантов ходов игрока2
						deleteField(x+i, y+j);
						if (field_own[y+j][x+i] !== -3) {
							cells[boderPosition].innerHTML += '<div class="forbidden"></div>';
						}else{
							if (cells[boderPosition].querySelector('.ship')) {
								cells[boderPosition].querySelector('.ship').remove();
							}
							cells[boderPosition].classList.add('field__cell_border');
						}
					}
				}
			}
		}
	}
}

//игрок2
function bot(){
	if (currentGamer !== 2) {
		return;
	}
	//Если свободных ходов нет, то return
	if (availableFields.length === 0) {
		return;
	}
	//Определяет рандомную позицию из возможныйх ячеек. Из нее находим y и x
	let position = randomPosition(availableFields),
		cell = availableFields[position], 
		y = Math.trunc(cell / number),
		x = cell % number; 

    //Если у нас есть массив ячеек раненого корабля. То уже опредяет рандомную позицию из возможных ячеек
	if (memberPositions.length) {
		let possible = possibleSolution(); 
		let random = randomPosition(possible);
		x = possible[random][0]; 
		y = possible[random][1]; 
		cell = possible[random][1]*10 + possible[random][0]; 
		position = availableFields.indexOf(cell); 
	}

	//Удаляет эту ячейку
	availableFields.splice(position, 1);
	audioExplosion();
	let fieldCell = document.querySelectorAll('.game__own .field__cell');
	//Выстрел мимо
	if (field_own[y][x] === 1 || field_own[y][x] === 2) {
		fieldCell[cell].innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="muff" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" xml:space="preserve"><g><circle cx="15" cy="15" r="15"/></g></svg>';
		currentGamer = 1;
		message(name2 + ' промазал(а). Ходит ' + name1);
		return;
	}
	//Выстрел в цель
	if (field_own[y][x] === 3) {
		field_own[y][x] = -3;
		//Определяет выстрел ранил или убил корабль
		for (let i = 0; i < shipsOwn.length; i++){
			for (let j = 0; j < shipsOwn[i].length - 1; j += 2){
				if (shipsOwn[i][j] === x && shipsOwn[i][j+1] === y) {
					shipsOwn[i][j] = x.toString();
					shipsOwn[i][j+1] = y.toString();
					//Определяет состояние корабля
					determineStateShip(shipsOwn[i], x, y, 2, fieldCell);
					//Вызывает игрока2 второй раз 
					currentStep();
					return;
				}
			}
		}
	}
}

/**
 * Возвращает возможные ходы, где расположен корабль
 * Если известно только одно положение корабля, то возможные ходы по вертикали или горизонтале (если они валидные)
 * Если известно несколько положении корабля, то определяет его ориентацию и возможные ходы будут либо по вертикали или горизонтале
 */
function possibleSolution(){
	let tempPosition = []; 
	if (memberPositions.length > 1) {
		for (let i = memberPositions.length - 1; i >= 0; i--){
			x = memberPositions[i].x;
			y = memberPositions[i].y; 
			if (memberPositions[0].x === memberPositions[1].x) {
				if (validPosition(x, y + 1)) {
					tempPosition.push([x, y + 1]);
					break;
				}else if (validPosition(x, y - 1)) {
					tempPosition.push([x, y - 1]);
					break;
				}
			}else{
				if (validPosition(x + 1, y)) {
					tempPosition.push([x + 1, y]);
					break;
				}else if (validPosition(x - 1, y)) {
					tempPosition.push([x - 1, y]);
					break;
				}
			}
		}
	}else if(memberPositions.length === 1){
		if ( validPosition(memberPositions[0].x - 1, memberPositions[0].y) ) {
			tempPosition.push([memberPositions[0].x - 1, memberPositions[0].y]);
		}
		if ( validPosition(memberPositions[0].x + 1, memberPositions[0].y) ) {
			tempPosition.push([memberPositions[0].x + 1, memberPositions[0].y]);
		}
		if ( validPosition(memberPositions[0].x, memberPositions[0].y - 1) ) {
			tempPosition.push([memberPositions[0].x, memberPositions[0].y - 1]);
		}
		if ( validPosition(memberPositions[0].x, memberPositions[0].y + 1) ) {
			tempPosition.push([memberPositions[0].x, memberPositions[0].y + 1]);
		}
	}
	return tempPosition;
}	

//Определяет, является ли поле с координатой x и y доступной среди полей, по которым можно произвести выстрел 
function validPosition(x,y){
	if (x >= 0 && x < number && y >= 0 && y < number && availableFields.indexOf(10*y+x) !== -1) {
		return true;
	}else{
		return false;
	}
}

//Проверяет конец игры, если он есть, то выводит сообщение кто выиграл и создает навигационную панель
function checkGameOver(){
	if (opponentDestroyedShips === 10 || myDestroyedShips === 10) {
		numberGame++;
		currentGamer = -1;
		if (opponentDestroyedShips === 10) {
			let lastScore = document.querySelectorAll('.score__result .score__number')[0];
			lastScore.innerHTML = Number(lastScore.innerText) + 1;
			message('Поздравляю! Вы выиграли');
		}else{
			let lastScore = document.querySelectorAll('.score__result .score__number')[1];
			lastScore.innerHTML = Number(lastScore.innerText) + 1;
			message(name2 + ' выиграл(а). Вы проиграли');
		}
		createNav();
	}
}

//Создает навигационную панель в DOM
function createNav(){
	let nav = document.createElement('div');
	nav.className = 'nav show_right';
	nav.innerHTML = ` 
		<button class="nav__continue" title="Сохранить результат и начать новую игру">Играть еще</button>
		<button class="nav__replay" title="Сохранить текущую позицию кораблей и переиграть">Переграть</button>
		<button class="nav__exit" title="Сбросить результат и выйти в меню">Выход</button>
	`;
	document.body.append(nav);
	addClick('.nav .nav__continue', continueGame);
	addClick('.nav .nav__replay', replayGame);
	addClick('.nav .nav__exit', exitGame);
	removeClick('.game__opponent .field__container', clickController);
}

//Удаляет навигационную панель
function deleteNav(){
	removeClick('.nav .nav__continue', continueGame);
	removeClick('.nav .nav__replay', replayGame);
	removeClick('.nav .nav__exit', exitGame); 
	document.querySelector('.nav').remove();
}

//Если нажата кнопка играть еще, то обнуляет заполненные данные и скрывает поля ввода.
function continueGame(){
	defaultSetting();
	document.querySelector('.message').innerHTML = '';
	document.querySelector('.game .game__opponent').remove();
	document.querySelector('.game__setting .form__data').style.display = 'none';
	document.querySelector('.game__setting').classList.remove('game__setting_none');
	changeLocation();
}

//Если нажата кнопка переиграть, то возвращает данные в исходные значения и отрисовывает корабли по старым координатам
function replayGame(){
	defaultSetting();
	document.querySelectorAll('.game__own .field__cell').forEach(cell => {
		cell.innerHTML = '';
		cell.className = 'field__cell';
	});
	for (let i = 0; i < number; i++){
		for (let j = 0; j < number; j++){
			if (field_own[i][j] === -3) {
				field_own[i][j] = 3;
			}
		}
	}
	for (let i = 0; i < shipsOwn.length; i++){
		for (let j = 0; j < shipsOwn[i].length; j++){
			shipsOwn[i][j] = Number(shipsOwn[i][j]);
		}
	}

	for (let i = 0; i < shipsOwn.length; i++){
		let cell = shipsOwn[i][1]*10 + shipsOwn[i][0];
		
		if (shipsOwn[i].length > 2) {
			if (shipsOwn[i][0] === shipsOwn[i][2]) {
				renderShip(cell, 1, Math.trunc(shipsOwn[i].length / 2) );
			}else{
				renderShip(cell, 0, Math.trunc(shipsOwn[i].length / 2) );
			}
		}else{
			renderShip(cell, 0, 1);
		}
	}
	for (let i = 0; i < number*number; i++){
		availableFields[i] = i;
	}
	document.querySelector('.game__opponent').remove();
	createFieldOpponent();
	createShipsOpponent();

	currentGamer = 2;
	if (numberGame % 2 === 0) {
		currentGamer = 1;
		message('Вы начинаете игру');
	}else{
		currentGamer = 2;
		message(name2 + ' начинает игру');
	}
	addClick('.game__opponent .field__container', clickController);
	currentStep();
}

//Если нажата кнопка выхода игры, то удаляет заполненные данные и возвращает стартовый экран приложения
function exitGame(){
	defaultSetting();
	document.querySelector('.game .game__opponent').remove();
	document.querySelector('.score').innerHTML = '';
	document.querySelector('.message').innerHTML = '';
	document.querySelector('.game__setting .form__data').style.display = 'block';
	document.querySelector('.game__setting').classList.remove('game__setting_none');
	numberGame = 0;
	changeLocation();
}

//Очищает массивы заполненных данных
function defaultSetting(){
    memberPositions = [];
	pushCells = [];
	myDestroyedShips = 0;
	opponentDestroyedShips = 0;
	availableFields = [];
	deleteNav();
}


/**
 * Устанавливает обработчик на кнопку
 * @param {selector} - селектор для нахождения элемента в DOM
 * @param {act} - действие на нажатие
 */
function addClick(selector, act){
	document.querySelector(selector).addEventListener('click', act);
}

/**
 * Удаляет обработчик на кнопку
 * @param {selector} - селектор для нахождения элемента в DOM
 * @param {act} - действие на нажатие
 */
function removeClick(selector, act){
	if (document.querySelector('selector')) {
		document.querySelector(selector).removeEventListener('click', act);
	}
}


/**
 * Выдает рандомную позицию из возможных для хода ячеек
 * @param {array} - array - массив возможных ячеек 
 */
function randomPosition(array){
	return Math.floor( Math.random()*(array.length));
}

/**
 * Удаляет ячейку среди возможных полей для хода игрока2
 * @param {x,y} - координаты ячейки
 */
function deleteField(x,y){
	if (x >= 0 && x < number && y >= 0 && y < number){
		if (availableFields.indexOf(y*10+x) !== -1) {
			availableFields.splice(availableFields.indexOf(y*10+x), 1);
		}
	}
	
}

/**
 * Заносит в двумерный массив соседние ячейки созданного корабля 
 * @param {y,x} - координаты ячейки
 * @param {position} - оринтация корябля (0 - горизонтально; 1 - вертикально)
 * @param {line} - длина корабля
 */
function createBorder(field,y,x,position,line){
	for (let i = -1; i < 2; i++){
		if (position === 0) {
			if (y+i >= 0 && y+i < number && x-1>=0) {
				field[y+i][x-1] = 2;
			}
			if (y+i >= 0 && y+i < number && x+line<number) {
				field[y+i][x+line] = 2;
			}
		}else{
			if (x+i >= 0 && x+i < number && y-1>=0) {
				field[y-1][x+i] = 2;
			}
			if (x+i >= 0 && x+i < number && y+line<number) {
				field[y+line][x+i] = 2;
			}
		}
	}
	for (let i = 0; i < line; i++){
		if (position === 0) {
			if (y-1 >=0 ) {
				field[y-1][x+i] = 2;
			}
			if (y+1 < number ) {
				field[y+1][x+i] = 2;
			}
		}else{
			if (x-1 >=0 ) {
				field[y+i][x-1] = 2;
			}
			if (x+1 < number ) {
				field[y+i][x+1] = 2;
			}
		}
	}
	return field;
}	

//Создает звуковое сопровождение при ходе
function audioExplosion(){
	let audio = new Audio(); 
	audio.src = 'audio/explosion.mp3'; 
	audio.autoplay = true; 
}
