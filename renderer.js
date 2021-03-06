//Настройка "холста"
		

		//Рисуем рамку
		function drawBorder(){
			ctx.fillStyle = "Gray";
			ctx.fillRect(0, 0, width, blockSize);
			ctx.fillRect(0, height - blockSize, width, blockSize);
			ctx.fillRect(0, 0, blockSize, height);
			ctx.fillRect(width - blockSize, 0, blockSize, height);
		};

		//Выводим счет игры
		function drawScore(){
			ctx.font = "20px Courier";
			ctx.fillStyle = "Black";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("Score: " + score, blockSize, blockSize);
		};

		//Вывод конца игры
		function gameOver(){
			clearInterval(intervalId);
			ctx.font = "60px Courier";
			ctx.fillStyle = "Black";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("Game over", width / 2, height / 2);
		};

		//Рисуем окружность
		function circle(x, y, radius, fillCircle){
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2, false);
			if (fillCircle) {
				ctx.fill();
			} else {
				ctx.stroke();
			}
		};

		//Конструктор создания объекта-блок
		function Block(col, row){
			this.col = col;
			this.row = row;
		};
		
		//Нарисовать квадрат
		Block.prototype.drawSquare = function(color){
			var x = this.col * blockSize;
			var y = this.row * blockSize;
			ctx.fillStyle = color;
			ctx.fillRect(x, y, blockSize, blockSize);
		};

		//Нарисовать круг
		Block.prototype.drawCircle = function(color){
			var centerX = this.col * blockSize + blockSize / 2;
			var centerY = this.row * blockSize + blockSize / 2;
			ctx.fillStyle = color;
			circle(centerX, centerY, blockSize / 2, true);
		};

		//Проверка совпадения позиций объектов
		Block.prototype.equal = function(otherBlock){
			return this.col === otherBlock.col && this.row === otherBlock.row;
		};

		//Конструктор создания объекто-змейки
		function Snake(){
			this.segments = [
				new Block(7, 5),
				new Block(6, 5),
				new Block(5, 5)
			];

			this.direction = "right";
			this.nextDirection = "right";
		};

		//Отрисовка змейки
		Snake.prototype.draw = function(){
			for(var i = 0; i < this.segments.length; i++)
			{
				if(i % 2 === 0){
					if(this.segments[i] === this.segments[0]) {
						this.segments[i].drawSquare("Red");
					} else {
						this.segments[i].drawSquare("Orange");
					}
				} else {
					if(this.segments[i] === this.segments[0]) {
						this.segments[i].drawSquare("Red");
					} else {
						this.segments[i].drawSquare("Green");
					}
				}

			}
		};

		//Передвижение змейки
		//создаём новую голову и добавляем её к началу змейки
		Snake.prototype.move = function(){
			var head = this.segments[0];
			var newHead;

			this.direction = this.nextDirection;

			if(this.direction === "right"){
				newHead = new Block(head.col + 1, head.row);
			}else if(this.direction === "down"){
				newHead = new Block(head.col, head.row + 1);
			}else if(this.direction === "left"){
				newHead = new Block(head.col - 1, head.row);
			}else if(this.direction === "up"){
				newHead = new Block(head.col, head.row - 1);
			}

			if(this.checkCollision(newHead)){
				gameOver();
				return;
			}

			this.segments.unshift(newHead);

			if(newHead.equal(apple.position)){
				score++;
				apple.move();
			}else{
				this.segments.pop();
			}
		};

		//Проверка на столкновения
		Snake.prototype.checkCollision = function(head){
			var leftCollision = (head.col === 0);
			var topCollision = (head.row === 0);
			var rightCollision = (head.col === widthInBlocks - 1);
			var bottomCollision = (head.row === heightInBlocks - 1);

			var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

			var selfCollision = false;

			for(var i = 0; i < this.segments.length; i++){
				if(head.equal(this.segments[i])){
					selfCollision = true;
				}
			}

			return wallCollision || selfCollision;
		}

		//Проверка направления
		Snake.prototype.setDirection = function(newDirection){
			if(this.direction === "up" && newDirection === "down"){
				return;
			}else if(this.direction === "right" && newDirection === "left"){
				return;
			}else if(this.direction === "down" && newDirection === "up"){
				return;
			}else if(this.direction === "left" && newDirection === "right"){
				return;
			}

			this.nextDirection = newDirection;
		};

		//Конструктор объекта-яблоко
		function Apple(){
			this.position = new Block(10, 10);
		};

		//Отрисовка яблока
		Apple.prototype.draw = function(){
			this.position.drawCircle("LimeGreen");
		};

		//Перемещение яблока
		Apple.prototype.move = function(){
			var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
			var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
			this.position = new Block(randomCol, randomRow);
		};