//растановка кораблей
`use strict`;

let field = [],
	availableFields = [],
	number = 10,
	counter = 0;
	memberPositions = [];

	
	
startGame();

function startGame(){
	field = [];
	for (let i = 0; i < number; i++){
		field[i] = [];
		for (let j = 0; j < number; j++){
			field[i][j] = 1;
		}
	}
	for (let i = 0; i < number*number; i++){
		availableFields[i] = i;
	}

	document.querySelectorAll('.field_cell').forEach(cell => {
		cell.innerHTML = '';
	})
	ranking(4);
	ranking(3);
	ranking(3);
	ranking(2);
	ranking(2);
	ranking(2);
	ranking(1);
	ranking(1);
	ranking(1);
	ranking(1);
	/*let timer = setInterval(function(){
		bot();
	},100)*/
}



function ranking(line){
	while(true){
		// 0 - горизонтально
		// 1 - вертикально
		let cell = Math.floor(Math.random() * number*number),
			position = Math.floor(Math.random() * 2);
			column = Math.trunc(cell / number);
			row = cell % number;
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
				createBorder(column,row,position,line);
				renderShip(cell, position, line);
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
				createBorder(column,row,position,line);
				renderShip(cell, position, line);
				break;
			}
		}

		
		counter++;
		if (counter > 100) {
			startGame();
			break;
		}
	}
}

function createBorder(y,x,position,line){
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
}	

function renderShip(cell,position, line){
	let fieldCell = document.querySelectorAll('.field__container .field_cell');
	let ship = document.createElement('div');
	ship.className = 'ship';


	let width = (position === 0) ? 40*line+2 : 42;
	let height = (position === 1) ? 40*line+2 : 42;
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
	/*console.log("availableFields", availableFields);
	console.log("availableFields.length", availableFields.length);
	console.log("position", position);
	console.log("cell", cell);*/
	availableFields.splice(position, 1);
	//console.log("availableFields", availableFields);

	//если ячейка мимо
	if (field[column][row] === 1 || field[column][row] === 2) {
		let fieldCell = document.querySelectorAll('.field__container .field_cell');
		fieldCell[cell].style.background = '#000000';
		/*field[column][row] === -1 * field[column][row];*/
		return;
	}
	//если ранил или убил
	if (field[column][row] === 3) {
		//let fieldCell = document.querySelectorAll('.field__container .field_cell');
		/*fieldCell[cell].style.background = '#000000';*/
		field[column][row] = -3;
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



//
function determineStateShip(x,y){

	let flag = true;
	for (let i = 0; i < memberPositions.length; i++){
		console.log("memberPositions", memberPositions);
		if (memberPositions[i].x - 1 >= 0 && field[memberPositions[i].y][memberPositions[i].x - 1] === 3) {
			flag = false;
			break;
		}
		if (memberPositions[i].x + 1 < number && field[memberPositions[i].y][memberPositions[i].x + 1] === 3) {
			flag = false;
			break;
		}
		if (memberPositions[i].y - 1 >= 0 && field[memberPositions[i].y - 1][memberPositions[i].x] === 3) {
			flag = false;
			break;
		}
		if (memberPositions[i].y + 1 < number && field[memberPositions[i].y + 1][memberPositions[i].x] === 3) {
			flag = false;
			break;
		}
	}

	let fieldCell = document.querySelectorAll('.field__container .field_cell');
	let cell = 10*y + x;
	/*let cell = positionY * 10 + positionX;
	let positionX = memberPositions[memberPositions.length-1].x;
	let positionY = memberPositions[memberPositions.length-1].y;*/

	if (flag === true) {
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

//
function freezeBorder(){
	for (let i = 0; i < memberPositions.length; i++){
		let x = memberPositions[i].x;
		let y = memberPositions[i].y;
		if (x-1 >= 0) {
			/*renderBorder(x-1,y);*/
			if (availableFields.indexOf(y*10+(x - 1)) !== -1) {
				availableFields.splice( availableFields.indexOf(y*10+(x - 1)) ,1);
			}
			renderBorder(x-1,y);
		}
		if (x+1 < number) {
			if (availableFields.indexOf(y*10+(x + 1)) !== -1) {
				availableFields.splice( availableFields.indexOf(y*10+(x + 1)), 1);
			}
			renderBorder(x+1,y);
		}
		if (y - 1 >= 0) {
			if (availableFields.indexOf( (y-1)*10+x ) !== -1) {
				availableFields.splice( availableFields.indexOf( (y-1)*10+x ), 1);
			}
			renderBorder(x,y-1);
		}
		if (y + 1 < number) {
			if (availableFields.indexOf( (y+1)*10+x ) !== -1) {
				availableFields.splice( availableFields.indexOf( (y+1)*10+x ), 1);
			}
			renderBorder(x,y+1);
		}
	}	
}

function renderBorder(x,y){
	let cell = 10*y + x;
	let fieldCell = document.querySelectorAll('.field__container .field_cell');
	fieldCell[cell].style.background = '#ab95f5';
}





/*function test(){
	console.log(1);
}*/

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
