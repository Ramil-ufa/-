//растановка кораблей
`use strict`;

let field_own = [],
	field_opponent = [],
	availableFields = [],
	memberPositions = [],
	pushCells = [],
	shipsOpponent = [],
	shipsOwn = [],
	name1 = '',
	name2 = '',
	currentGamer = 1,
	myDestroyedShips = 0,
	opponentDestroyedShips = 0,
	number = 10;




startApp();
function startApp(){
	changeLocation();
	addClick('.form .form__change', changeLocation);
	addClick('.form .form__start', startGame);
}


function changeLocation(){
	document.querySelectorAll('.game__own .field__cell').forEach(cell => {
		cell.innerHTML = '';
		cell.className = 'field__cell';
	})
	for (let i = 0; i < number; i++){
		field_own[i] = [];
		for (let j = 0; j < number; j++){
			field_own[i][j] = 1;
		}
	}
	let ships = [4,3,3,2,2,2,1,1,1,1];
	shipsOwn = [];
	for (let i = 0; i < ships.length; i++){
		field_own = ranking(field_own, ships[i], 1);
	}
}

function startGame(){
	message();
	name1 = document.querySelector('.form__input_own').value,
	name2 = document.querySelector('.form__input_opponent').value;
	
	if (!/^[A-zА-я0-9]{3,30}$/i.test(name1) ) {
		message('Ваше имя должно состоять из букв латинского или русского языка длиной от 3 до 30 символов');
		return;
	}
	if (!/^[A-zА-я0-9]{3,30}$/i.test(name2) ) {
		message('Имя компьютера должно состоять из букв латинского или русского языка длиной от 3 до 30 символов')
		return;
	}

	name1 = name1[0].toUpperCase() + name1.slice(1);
	name2 = name2[0].toUpperCase() + name2.slice(1);

	document.querySelector('.game .game__setting').classList.add('game__setting_none');
	createTitle(name1, name2);
	createFieldOpponent();
	addClick('.game__opponent .field__container', clickController);
	createShipsOpponent();
	message('Вы начинаете игру');
	currentGamer = 1;
	currentStep();	
}

function createTitle(name1, name2){
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

	let word = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
	for (let i = 0; i < 10; i++){
		cell += `<div class="words__cell">${word[i]}</div>`
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
function ranking(field, line, chooseField){
	while(true){
		// 0 - горизонтально
		// 1 - вертикально
		let cell = Math.floor(Math.random() * number*number),
			position = Math.floor(Math.random() * 2),
			column = Math.trunc(cell / number),
			row = cell % number,
			rightPosition = true,
			tempShips = [];

		if (position === 0) {
			for (let i = 0; i < line; i++){
				if (typeof(field[column][row+i]) === "undefined" || field[column][row+i] === 2 || field[column][row+i] === 3){
					rightPosition = false;
					break;
				}
			}
			if (rightPosition === true) {
				for (let i = 0; i < line; i++){
					field[column][row+i] = 3;
					tempShips.push(row + i, column);
				}
				field = createBorder(field, column,row,position,line);
				if (chooseField === 1) {
					shipsOwn.push(tempShips);
					renderShip(cell, position, line);
				}else{
					shipsOpponent.push(tempShips);
				}
				break;
			}
		}else{
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

function currentStep(){
	if (currentGamer === -1 ) {
		return
	}
	currentGamer = 2;
	if (currentGamer === 2){
		setTimeout(bot,50);
	}
}

function message(text = ''){
	document.querySelector('.message').innerText = text;
}




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

	if (pushCells.indexOf(position) === -1) {
		pushCells.push(position);
		checking(position);
	}
}

function checking(position){
	let y = Math.trunc(position / number),
		x = position % number;
	let fieldCell = document.querySelectorAll('.game__opponent .field__cell');
	if (field_opponent[y][x] === 1 || field_opponent[y][x] === 2) {
		fieldCell[position].innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="muff" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" xml:space="preserve"><g><circle cx="15" cy="15" r="15"/></g></svg>';
		currentGamer = 2;
		message('Вы промазали. Ходит ' + name2);
		currentStep();
		return
	}
	//если ранил или убил
	if (field_opponent[y][x] === 3) {
		field_opponent[y][x] = -3;
		// определяем убил или ранил
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


function determineStateShip(ships,x,y,chooseField,fieldCell){
	let destroyShip = true,
		position = 10*y + x;
	for (let i = 0; i < ships.length; i++){
		if (typeof(ships[i]) === 'number') {
			destroyShip = false;
			break;
		}
	}
	if (destroyShip === true) {
		fieldCell[position].innerHTML += '<div class="pinpoint"></div>';
		renderChangeState(ships, fieldCell, chooseField);
		if (chooseField === 2) {
			memberPositions = [];
			myDestroyedShips++;	
			console.log('бот убил');
			message(name2 + ' убил ваш корабль. Ходит ' + name2);
			
		}else{
			opponentDestroyedShips++;
			message('Вы убили корабль. Ходит ' + name1);
			console.log('я убил');	
		}
		checkGameOver();
	}else{
		fieldCell[position].innerHTML += '<div class="pinpoint"></div>';
		if (chooseField === 2) {
			memberPositions.push({y: y, x: x});
			console.log('Бот ранил');
			message(name2 + ' ранил ваш корабль. Ходит ' + name2);
		}else{
			console.log('я ранил');
			message('Вы ранили корабль. Ходит ' + name1);
		}
	}
}

function renderChangeState(ships,cells,chooseField){
	for (let index = 0; index < ships.length; index += 2){
		let x = Number(ships[index]);
		let y = Number(ships[index+1]);
		let position = 10*y + x;
		for (let i = -1; i <= 1 ;i++){
			for (let j = -1; j <= 1; j++){
				if (x+i >= 0 && x+i < number && y+j >= 0 && y+j < number){
					let boderPosition = 10*(y+j) + (x+i); 
					if (chooseField === 1) {
						if (pushCells.indexOf(boderPosition) === -1) {
								pushCells.push(boderPosition);
						}
						if (field_opponent[y+j][x+i] !== -3) {
							cells[boderPosition].innerHTML += '<div class="forbidden"></div>';
						}else{
							cells[boderPosition].classList.add('field__cell_border');
						}
					}else{
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

function bot(){
	if (currentGamer !== 2) {
		return;
	}
	if (availableFields.length === 0) {
		console.log('Свободных ходов нет');
		return;
	}
	let position = randomPosition(availableFields), //рандомная позиция в массиве availableFields
		cell = availableFields[position]; // номер ячейки
		y = Math.trunc(cell / number), // y - ячейки
		x = cell % number; // x - ячейки

	if (memberPositions.length) {
		let result = possibleSolution(); // возвращает x, y ячейки
		let random = randomPosition(result);
		x = result[random][0]; // x - ячейки
		y = result[random][1]; // y - ячейки
		cell = result[random][1]*10 + result[random][0]; // 
		position = availableFields.indexOf(cell); // позиция в массиве availableFields
	}

	//удаляем эту ячейку
	availableFields.splice(position, 1);
	let fieldCell = document.querySelectorAll('.game__own .field__cell');
	//если выстрел мимо
	if (field_own[y][x] === 1 || field_own[y][x] === 2) {
		fieldCell[cell].innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="muff" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" xml:space="preserve"><g><circle cx="15" cy="15" r="15"/></g></svg>';
		currentGamer = 1;
		message(name2 + ' промазал(а). Ходит ' + name1);
		//удалить
		currentStep();
		return;
	}
	//если ранил или убил
	//если ранил или убил
	if (field_own[y][x] === 3) {
		field_own[y][x] = -3;
		// определяем убил или ранил
		for (let i = 0; i < shipsOwn.length; i++){
			for (let j = 0; j < shipsOwn[i].length - 1; j += 2){
				if (shipsOwn[i][j] === x && shipsOwn[i][j+1] === y) {
					shipsOwn[i][j] = x.toString();
					shipsOwn[i][j+1] = y.toString();
					determineStateShip(shipsOwn[i], x, y, 2, fieldCell);
					currentStep();
					return;
				}
			}
		}
	}
}

function possibleSolution(){
	let tempPosition = []; 
	if (memberPositions.length > 1) {
		for (let i = memberPositions.length - 1; i >= 0; i--){
			x = memberPositions[i].x;
			y = memberPositions[i].y; 
			if (memberPositions[0].x === memberPositions[1].x) {
				console.log('Вертикально')
				if (validPosition(x,y+1)) {
					tempPosition.push([x, y + 1])
					break;
				}else if (validPosition(x,y - 1)) {
					tempPosition.push([x, y - 1])
					break;
				}
			}else{
				console.log('Горизонтально')
				if (validPosition(x + 1, y)) {
					tempPosition.push([x + 1, y])
					break;
				}else if (validPosition(x - 1,y)) {
					tempPosition.push([x - 1, y])
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

function validPosition(x,y){
	if (x >= 0 && x < number && y >= 0 && y < number && availableFields.indexOf(10*y+x) !== -1) {
		return true;
	}else{
		return false;
	}
}


function checkGameOver(){
	if (opponentDestroyedShips === 10 || myDestroyedShips === 10) {
		console.log('тут');
		currentGamer = -1;
		if (opponentDestroyedShips === 10) {
			let lastScore = document.querySelectorAll('.score__result .score__number')[0];
			lastScore.innerHTML = Number(lastScore.innerText) + 1;
			message('Поздравляю. Вы выиграли');
			createNav();
		}else{
			let lastScore = document.querySelectorAll('.score__result .score__number')[1];
			lastScore.innerHTML = Number(lastScore.innerText) + 1;
			message(name2 + ' выиграл(а). Вы выиграли');
			createNav();
		}
	}
}

function createNav(){
	let nav = document.createElement('div');
	nav.className = 'nav show_right';
	nav.innerHTML = ` 
		<button class="nav__continue" title="Сохранить результат и играть еще">Играть еще</button>
		<button class="nav__replay" title="Сохранить текущую позицию кораблей и переиграть">Переграть</button>
		<button class="nav__exit" title="Сбросить результат и выйти в меню">Выйти в меню</button>
	`;
	document.body.append(nav);
	addClick('.nav .nav__continue', continueGame);
	addClick('.nav .nav__replay', replayGame);
	addClick('.nav .nav__exit', exitGame);
	removeClick('.game__opponent .field__container', clickController);
}

function continueGame(){
	alert('продолжить игру');
}

function replayGame(){
	alert('продолжить игру');
}

function exitGame(){
	alert('конец игру');
	removeClick('.nav .nav__continue', continueGame);
	removeClick('.nav .nav__replay', replayGame);
	removeClick('.nav .nav__exit', exitGame);
	document.querySelector('.game .game__opponent').remove();
	document.querySelector('.score').innerHTML = '';
	document.querySelector('.message').innerHTML = '';
	document.querySelector('.nav').remove();
	document.querySelector('.game__setting ').classList.remove('game__setting_none');
	changeLocation();
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

function deleteField(x,y){
	if (x >= 0 && x < number && y >= 0 && y < number){
		if (availableFields.indexOf(y*10+x) !== -1) {
			availableFields.splice(availableFields.indexOf(y*10+x), 1);
		}
	}
	
}

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

function renderShip(cell, position, line){
	let fieldCell = document.querySelectorAll('.game__own .field__cell');	
	let ship = document.createElement('div');
	let width = (position === 0) ? 35*line+2 : 37;
	let height = (position === 1) ? 35*line+2 : 37;
	
	ship.className = 'ship';
	ship.style.width = width + 'px';
	ship.style.height = height + 'px';
	fieldCell[cell].append(ship);
}







