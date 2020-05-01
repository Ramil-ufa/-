//растановка кораблей
let field = [];
number = 10;



let counter = 0;



startGame();

function startGame(){
	field = [];
	for (let i = 0; i < number; i++){
		field[i] = [];
		for (let j = 0; j < number; j++){
			field[i][j] = 0;
		}
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
				if (typeof(field[column][row+i]) === "undefined" || field[column][row+i] === 1 || field[column][row+i] === 2){
					rightPosition = false;
					break;
				}
			}
			if (rightPosition === true) {
				for (let i = 0; i < line; i++){
					field[column][row+i] = 2;
				}
				createBorder(column,row,position,line);
				renderShip(cell, position, line);
				break;
			}
		}else{
			for (let i = 0; i < line; i++){
				if (typeof(field[column+i]) === "undefined" || field[column+i][row] === 1 || field[column+i][row] === 2) {
					rightPosition = false;
					break;
				}
			}
			if (rightPosition === true) {
				for (let i = 0; i < line; i++){
					field[column+i][row] = 2;
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
				field[y+i][x-1] = 1;
			}
			if (y+i >= 0 && y+i < number && x+line<number) {
				field[y+i][x+line] = 1;
			}
		}else{
			if (x+i >= 0 && x+i < number && y-1>=0) {
				field[y-1][x+i] = 1;
			}
			if (x+i >= 0 && x+i < number && y+line<number) {
				field[y+line][x+i] = 1;
			}
		}
	}
	for (let i = 0; i < line; i++){
		if (position === 0) {
			if (y-1 >=0 ) {
				field[y-1][x+i] = 1;
			}
			if (y+1 < number ) {
				field[y+1][x+i] = 1;
			}
		}else{
			if (x-1 >=0 ) {
				field[y+i][x-1] = 1;
			}
			if (x+1 < number ) {
				field[y+i][x+1] = 1;
			}
		}
	}

	/*if (position === 0) {

		for (let i = -1; i< 2; i++){
			if (y+i >= 0 && y+i < number && x-1>=0) {
				field[y+i][x-1] = 1;
			}
			if (y+i >= 0 && y+i < number && x+line<number) {
				field[y+i][x+line] = 1;
			}
			
		}
		for (let i = 0; i<line; i++){
			if (y-1 >=0 ) {
				field[y-1][x+i] = 1;
			}
			if (y+1 < number ) {
				field[y+1][x+i] = 1;
			}
		}
	}
	if (orientir === 1) {
		for (let i = -1; i<2; i++){
			if (x+i >= 0 && x+i < number && y-1>=0) {
				field[y-1][x+i] = 1;
			}
			if (x+i >= 0 && x+i < number && y+line<number) {
				field[y+line][x+i] = 1;
			}
			
		}
		for (let i = 0; i<line; i++){
			if (x-1 >=0 ) {
				field[y+i][x-1] = 1;
			}
			if (x+1 < number ) {
				field[y+i][x+1] = 1;
			}
		}
	}
	console.log(field)*/
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




