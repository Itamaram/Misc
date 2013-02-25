var dir = {'x':0, 'y':0};
var snake = Array();
var apple = {'x':-1, 'y': -1};
var gridHeight = 20;
var gridWidth = 40;
var dirArray = ['up', 'left', '', 'right', 'down'];
var ticker;

$().ready(function(){
	gridInit();
	gameInit();
	keybindInit();
	startGame();
});

function startGame()
{
	ticker = setInterval(tick, 100);
}

function gameInit()
{
	spawnApple();
	snake = Array();
	snake.push({'x':gridWidth/2, 'y':gridHeight/2});
	cellFromPoint(snake[0]).addClass('snake shead');
}

function keybindInit()
{
	$(document).keydown(function(e){
		var newDir;
		if(e.keyCode == 37){ newDir={'x':0,'y':-1};}
		else if (e.keyCode == 38){ newDir={'x':-1,'y':0};}
		else if (e.keyCode == 39){ newDir={'x':0,'y':1};}
		else if(e.keyCode == 40){ newDir={'x':1,'y':0};}
		else if(e.keyCode == 13){ reset(); return;}
		if(newDir !== undefined)
		{
			if(snake.length > 1 && eqPoint(snake[1], addPoint(snake[0], newDir))) 
					return;
			dir = newDir;
		}
	});
}

function gridInit()
{
	for(var x = 0 ; x < gridWidth ; x++)
	{
		var tr = $('<tr></tr>');
		for(var y = 0 ; y  <gridHeight ; y++)
			tr.append($('<td></td>'));
		$('#grid').append(tr);
	}
}
	
function tick()
{
	var oldHead = snake[0];
	var newHead = addPoint(oldHead, dir);
	
	if(newHead.x < 0 || gridWidth <= newHead.x || newHead.y < 0 || gridHeight <= newHead.y || cellFromPoint(newHead).hasClass('sbody'))
	{
		defeat();
		return;
	}
	
	cellFromPoint(oldHead).removeClass('shead').addClass('sbody');
	cellFromPoint(newHead).addClass('snake shead').addClass(dirToString(dir));
	
	
	snake = [newHead].concat(snake);
	if(snake.length > 2)
	{
		var classStr = Array();
		for(var i = 1 ; i <= 2 && i < snake.length; i++)
		{
			classStr.push(dirToString(subPoint(snake[i-1], snake[i])))
		}
		cellFromPoint(snake[1]).addClass('rainbow ' + classStr.reverse().join('-'));
	}
	
	var tail = snake.pop();
	
	if(eqPoint(apple, newHead))
	{
		addScore(10);
		snake.push(tail);
		spawnApple();
	}
	else if(!eqPoint(newHead, tail))
		cellFromPoint(tail).removeClass();
	else
		cellFromPoint(tail).removeClass('snake sbody');
}

function spawnApple()
{
	$('.apple').removeClass('apple');
	do
	{
		apple.x = rand(gridWidth);
		apple.y = rand(gridHeight);
	}while(cellFromPoint(apple).hasClass('snake'))
	cellFromPoint(apple).addClass('apple');
}

function defeat()
{
	clearInterval(ticker);
	$('#defeat').show();
}

function reset()
{
	clear();
	gameInit();
	startGame();
}

function clear()
{
	$('.snake').removeClass();
	$('.apple').removeClass();
	clearInterval(ticker);
	resetScore();
	dir = {'x':0, 'y':0};
	$('#defeat').hide();
}

function getScore(){ return parseInt($('#score').text().match(/\d+/)); }

function setScore(x){ $('#score').text($('#score').text().replace(/\d+/, x)); }

function addScore(x){ setScore(getScore() + x);	}

function resetScore(){ setScore(0);	}

function dirToString(d) {return dirArray[d.x *2 + d.y + 2];}

function subPoint(p1, p2) {return {'x': p1.x - p2.x, 'y': p1.y - p2.y};}

function addPoint(p1, p2) {return {'x': p1.x + p2.x, 'y': p1.y + p2.y};}

function eqPoint(p1, p2) {return p1.x == p2.x && p1.y == p2.y;}

function rand(x) { return Math.floor(Math.random() * x); }

function cellFromPoint(p) { return $('#grid tr:eq(' + p.x + ') td:eq(' + p.y + ')'); }