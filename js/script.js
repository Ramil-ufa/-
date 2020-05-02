//растановка кораблей
`use strict`;

let field_own = [],
	field_opponent = [],
	availableFields = [],
	memberPositions = [],
	number = 10;
	

	
startGame();

function startGame(){
	field_own = [];
	field_opponent = [];
	for (let i = 0; i < number; i++){
		field_own[i] = [];
		field_opponent[i] = [];
		for (let j = 0; j < number; j++){
			field_own[i][j] = 1;
			field_opponent[i][j] = 1;
		}
	}
	for (let i = 0; i < number*number; i++){
		availableFields[i] = i;
	}
	document.querySelectorAll('.game__own .field__cell').forEach(cell => {
		cell.innerHTML = '';
	})
	createShip();
	/*setInterval(function(){
		bot();
	},10);*/
}

function createShip(){


	let ships = [4,3,3,2,2,2,1,1,1,1];
	for (let i = 0; i < ships.length; i++){
		field_own = ranking(field_own, ships[i], 1);
		field_opponent = ranking(field_opponent, ships[i], 2);
	}
	for (let i = 0; i < ships.length; i++){
		
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
			rightPosition = true;

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
				}
				field = createBorder(field, column,row,position,line);
				renderShip(cell, position, line, chooseField);
				/*if (chooseField === 1) {
					
				}*/
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
				}
				field = createBorder(field, column,row,position,line);
				renderShip(cell, position, line, chooseField);
				/*if (chooseField === 1) {
					
				}*/
				break;
			}
		}
	}
	return field;
}

function createBorder(field, y,x,position,line){
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

function renderShip(cell, position, line, chooseField){
	let fieldCell
	if (chooseField === 1) {
		fieldCell = document.querySelectorAll('.game__own .field__cell');
	}else{
		fieldCell = document.querySelectorAll('.game__opponent .field__cell');
	}
	
	let ship = document.createElement('div');
	let width = (position === 0) ? 40*line+2 : 42;
	let height = (position === 1) ? 40*line+2 : 42;
	
	ship.className = 'ship';
	ship.style.width = width + 'px';
	ship.style.height = height + 'px';
	fieldCell[cell].append(ship);
}

/**
 * Выдает рандомную позицию из возможных для хода ячеек
 * @param {array} - array - массив возможных ячеек 
 */
function randomPosition(array){
	return Math.floor( Math.random()*(array.length));
}

function bot(){
	if (availableFields.length === 0) {
		console.log('Нету свободных ячеек');
		return;
	}

	let position = randomPosition(availableFields), //рандомная позиция в массиве availableFields
		cell = availableFields[position]; // номер ячейки
		column = Math.trunc(cell / number), // y - ячейки
		row = cell % number; // x - ячейки

	if (memberPositions.length) {
		let result = possibleSolution(); // возвращает x, y ячейки
		let random = randomPosition(result);
		row = result[random][0]; // x - ячейки
		column = result[random][1]; // y - ячейки
		cell = result[random][1]*10 + result[random][0]; // 
		position = availableFields.indexOf(cell); // позиция в массиве availableFields
	}

	//удаляем эту ячейку
	availableFields.splice(position, 1);

	//если выстрел мимо
	if (field_own[column][row] === 1 || field_own[column][row] === 2) {
		let fieldCell = document.querySelectorAll('.game__own .field__cell');
		fieldCell[cell].style.background = '#000000';
		return;
	}
	//если ранил или убил
	if (field_own[column][row] === 3) {
		field_own[column][row] = -3;
		// запоминаем ячейку
		memberPositions.push({y: column, x: row});
		// определяем убил или ранил
		determineStateShip(row, column);
		return;
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
				}else if (validPosition(x,y-1)) {
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




function determineStateShip(x,y){
	let destroyShip = true;
	for (let i = 0; i < memberPositions.length; i++){
		let item = memberPositions[i];
		if ( (item.x - 1 >= 0 && field_own[item.y][item.x - 1] === 3) || 
			 (item.x + 1 < number && field_own[item.y][item.x + 1] === 3) || 
			 (item.y - 1 >= 0 && field_own[item.y - 1][item.x] === 3) || 
			 (item.y + 1 < number && field_own[item.y + 1][item.x] === 3) ) {
			destroyShip = false;
			break;
		}
	}

	let fieldCell = document.querySelectorAll('.game__own .field__cell'),
		cell = 10*y + x;

	if (destroyShip === true) {
		fieldCell[cell].style.background = '#ff0000';
		fieldCell[cell].innerHTML = 'у';
		freezeBorder();
		memberPositions = [];	
		console.log('убил');
		return true;
	}else{
		fieldCell[cell].style.background = '#e9f542';
		fieldCell[cell].innerHTML = 'р';
		console.log('ранил');
		return false;
	}
}

function deleteField(x,y){
	if (x >= 0 && x < number && y >= 0 && y < number){
		if (availableFields.indexOf(y*10+x) !== -1) {
			availableFields.splice(availableFields.indexOf(y*10+x), 1);
		}
		renderBorder(x, y);
	}
	
}



function freezeBorder(){
	for (let i = 0; i < memberPositions.length; i++){
		let x = memberPositions[i].x;
		let y = memberPositions[i].y;

		for (let i = -1; i <= 1 ;i++){
			for (let j = -1; j <= 1; j++){
				if (i === 0 && j === 0) {
					continue;
				}
				deleteField(x + i, y + j);
			}
		}
	}	
}

function renderBorder(x,y){
	if (field_own[y][x] === -3) {
		return;
	}
	let cell = 10*y + x;
	let fieldCell = document.querySelectorAll('.game__own .field__cell');
	fieldCell[cell].style.background = '#ab95f5';
}







/*let cross = document.createElement('div');
cross.className = 'hit';
cross.innerHTML = `
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" class="hit__cross"
		 	viewBox="0 0 612.043 612.043" style=""
		 xml:space="preserve">
		 <g>
		 	<path d="M397.503,306.011l195.577-195.577c25.27-25.269,25.27-66.213,0-91.482c-25.269-25.269-66.213-25.269-91.481,0
		 		L306.022,214.551L110.445,18.974c-25.269-25.269-66.213-25.269-91.482,0s-25.269,66.213,0,91.482L214.54,306.033L18.963,501.61
		 		c-25.269,25.269-25.269,66.213,0,91.481c25.269,25.27,66.213,25.27,91.482,0l195.577-195.576l195.577,195.576
		 		c25.269,25.27,66.213,25.27,91.481,0c25.27-25.269,25.27-66.213,0-91.481L397.503,306.011z"/>
		 </g>
	</svg>
`;
fieldCell[cell].append(cross);*/
