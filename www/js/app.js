/*********************************************;
*  Project        : STONE
*  Program name   : Client
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game frontend   
 *********************************************/	

 
 
/*********************************************;
 *  LOCAL GAME OBJECT
 *********************************************/	

const game = { 
	client : {
		nickName:"Mozgoprav",              
		isWinner:"none",      
		isWinnerBattle:1,  					
		selectButton:"noSign", 
		wins:0,                 
		fatalitySigns: [],      
		fatalitySignsClicked: [], 					
	}, 	
	enemy : { 
		nickName:"Marazmatik",       		   
		isWinner:"none",     
		selectButton:"noSign",  
		wins:0,                             
		timerTest1:0,               	
	},  
	fightRound:0, 
	timerFightVal: 7000, 
	timerFight:0,
                
	timerFatality: 10000,	
	flagFatality:false				
};



/*********************************************;
 *  CONSTRUCTOR CLIENT
 *********************************************/
			
const Client = {
  init: () => { 
	return Client.connectFirst();
  },	
  
  /** connect to server */	
  connectFirst: () => {
	console.log('first connect'); 	  
    $.get('/api/session/hello')
      .done(function(result) {		  
        game.client.nickName = result.name;
		Screen.seeServer();			
      });
  },
  
  /** search enemy */
  apiFindEnemy: () => {
	$.post("/api/user/find-game")
		.then(function(result) {
			if (result.state === 'playing') {
				return Client.meetingPlayers();
			} else { 
				setTimeout( Client.apiFindEnemy, 500 ); 
			}
		});
  },
  
  /** get First gameObject */
  meetingPlayers: () => {
	$.get('/api/game', function(result) {
		game.enemy.nickName = result.enemy.name;
		Screen.initBattle(); 
		console.log(result);
	});
  },

  /** wait Enemy Choise */
  updateGameResult: (result) => {
	if (result.enemyMadeChoice) {
		var allresults = result.results;
		var lastresult = allresults[allresults.length-1];
		game.enemy.selectButton = lastresult.enemyChoice;				
	} else {
		setTimeout(() => {
			$.get('/api/game').done(updateGameResult)
		}, 500);
	}
  },
  
  /** get enemy Choise */
  waitEnemyChoice: () => {
	$.get('/api/game').done(function(results) {
		if (results.enemyMadeChoice) {
			Screen.enemyMadeChoice(); 
		}
	})
  },

  /** send player Choise */
  sendHeroChoise: (choise) => { 
  		$.post('/api/game/move?choice=' + choise)
			.then(updateGameResult);
  },	 
  
  /** endTimer fight round */
  endTimerFight: () => { 
	$.post('/api/game/move?choice=timeout')
		.then(updateGameResult);
  }
} 



/*********************************************;
 *  CONSTRUCTOR SCREEN
 *********************************************/

const Screen = {
  
  waitEnemyTimer : null,
	  
  init:() => {
    $('.choise').hide();
	$('#search').hide();
  },
  
  seeServer: () => {
    $('#info').append('Connecting Done! <br/> your name: ' + game.client.nickName + '<br/>');
	$('#info').append('---------------------------------------<br/>');	  
	$('#search').show();
	$('#search').click( function(){
	  $('#info').append("Searching enemy:");
	  Client.apiFindEnemy();
	  Screen.waitEnemy();
	  $('#search').hide();		  
    });  
  },
  
  waitEnemy: () => {
    $('#info').append('*');
    Screen.waitEnemyTimer = setTimeout(Screen.waitEnemy, 200);
  },
 
  initBattle: () => {
    clearTimeout( Screen.waitEnemyTimer );	 
    $('#info').append('ok.<br/ >---------------------------------------<br/>');	
    $('#info').append('Find Enemy: ' + game.enemy.nickName + '<br/>');
    $('#info').append('---------------------------------------<br/>');	
    $('#info').append('Round!: <br/>');		
    $('.choise').show();
    Screen.waitEnemyTimer = setTimeout(Screen.waitEnemy, 200);	
  },
  
  enemyMadeChoice(){
    $('#info').append('!Enemy Choise!');	
  }
   
}	



/*********************************************;
 *  INIT GAME
 *********************************************/
  
Screen.init();
Client.init();
