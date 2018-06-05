/***********************************************;
*  Project        : STONE
*  Program name   : main
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : use phaser   
***********************************************/	


/** GAME VARS *********************************/

let intervalListenChoiceEnemy = null,
timerRound = null,
timerUpdateGameResult = null,
  
gameStatus = 'none',
randomFatalityHash = null,	
timerEndFatality = null 

const client = new Client()
const ctx = new Ctx() 


/** INIT GAME *******************************/

const init = () => { 
  initButtonSearchEnemy()
  initButtonsChoiceHero()
  connectFirst()
}
  
  
const initButtonSearchEnemy = () => {
  $( '#buttonSearch' ).hide()     
  $( '#buttonSearch' ).click(() => {
    $( '#info' ).append( 'Searching enemy:...' )
    $( '#buttonSearch' ).hide()
    startAnimationWait()
    apiFindEnemy()
  })   
}  
  
  
const initButtonsChoiceHero = () => {
  $( '.buttonsChoice' ).hide()     
  $( '.buttonsChoice' ).click(( e ) => {
    if ( gameStatus != 'wait-choice-fatality' ) {			
      $('.buttonsChoice').hide();			
      sendHeroChoice( e.target.value )
    } else {
      checkFatalityDone( e.target.value, () => {} )
    }				
  })    
}  
    
    
const connectFirst = () => {	  
  client.getSignIfConnectFirst(( serverResult ) => {
    $( '#info' ).append( 'Connecting done! <br/>' + 'your name: ' + serverResult.name + line )
    $( '#buttonSearch' ).show();		    
  })
}
    
  
const apiFindEnemy = () => {
  client.sendSignToFindEnemy(( serverResult ) => {
    if ( serverResult.state === 'playing' ) {
      stopAnimationWait()
      meetingPlayers()					
    } else { 
      setTimeout( apiFindEnemy, 500 ); 
    }      
  })
}
    
    
const meetingPlayers = () => {
  client.getSignAboutUpdateGameResult(( serverResult ) => {
    $( '#info' ).append( 'ok.' + line + 'Find Enemy: ' + serverResult.enemy.name)
    startRound()	    
  }) 
}


/** FUNCTIONS PLAY ROUND *******************/
  
const startRound = () => {
  $( '#info' ).append( line + 'Round:<br/>' )
  startAnimationWait()
  $( '.buttonsChoice' ).show()	
  intervalListenChoiceEnemy = setInterval( waitEnemyChoice, 1000 )
  timerRound = setTimeout( endTimerRound, 7000 )		
}
    
  
const waitEnemyChoice = () => {
  client.getSignAboutUpdateGameResult(( serverResult ) => {
    if ( serverResult.enemyMadeChoice ) {	
      clearInterval( intervalListenChoiceEnemy )		
      $( '#info' ).append( 'Enemy made choice.' )
    }
  })
}		
    
    
const sendHeroChoice = ( choice ) => { 
  $( '#info' ).append( 'You: ' + choice + '<br/>' )	
  client.sendHeroChoice( choice, ( serverResult ) => {
    updateGameResult( serverResult )
  }) 
}	 


const endTimerRound = () => { 
  clearInterval( intervalListenChoiceEnemy )
  client.sendHeroChoice( 'timeout', ( serverResult ) => {
    updateGameResult( serverResult )
  })
}


const updateGameResult = ( serverResult ) => {	
  if ( serverResult.enemyMadeChoice ) {	
    clearTimeout( timerUpdateGameResult )
    clearTimeout( timerRound )
    stopAnimationWait()
    $('#info').append(
      '<br/>Your: ' + serverResult.results[serverResult.results.length-1].myChoice + 
      ' / Enemy: ' + serverResult.results[serverResult.results.length-1].enemyChoice + 
      ' / Winner: ' + serverResult.results[serverResult.results.length-1].winner + 
      '<br/>'
    )		
    setTimeout( nextRound, 2000 )
  } else {
    timerUpdateGameResult = setTimeout( () => {
      client.getSignAboutUpdateGameResult(( serverResult ) => {
        updateGameResult( serverResult )
      })            				
    }, 500)
  }  
}


const nextRound = () => {
  client.sendReadyForNextRound(( serverResult ) => {
    if ( serverResult.state === 'over') {
      endBattle()
    }
    if ( serverResult.state === 'wait_fatality') { 
      gameStatus = 'wait-choice-fatality'
      startFatality( serverResult ) 
      console.log( 'end Game' )		
    }
    if ( serverResult.state !== 'fatality' && serverResult.state !== 'wait_fatality'   ) { 
      startRound()		
    }
  })
}

  
/** FUNCTIONS END GAME *********************/
  
const startFatality = ( serverResult ) => {
  gameStatus = 'wait-choice-fatality'
  startAnimationWait()
  if ( serverResult.winner === 'me' ) {
    timerEndFatality = setTimeout( () => { 
        postWinnerResultFatality( 'miss' ) 
      }, 10000 );	      	
    makeHashFatality();
    $( '.buttonsChoice' ).show();
  }
  if ( serverResult.winner === 'enemy' ) {
    timerEndFatality = setTimeout(() => { 
        endFatality() 
      }, 14000 )
    $( '#info' ).append( '<br/>wait Death...' )
    loserWaitResultFatality()		
  }
}
  
  
const makeHashFatality = () => {		
  randomFatalityHash = [];
  $( '#info' ).append( '<br/>Fatality: ' );
  for ( let i = 0; i < 5; i ++ ) {
    let n = Math.floor( Math.random()*3 );
    if ( n == 0 ) {
      setValueInHash( 'stone' )
    }
    if ( n == 1 ) {
      setValueInHash( 'scissors' )			
    }
    if ( n == 2 ) {
      setValueInHash( 'paper' )			
    }					
  }
}


const setValueInHash = value => {
  randomFatalityHash.push( value )
  $('#info').append( ' ' + value )
}    
  
  
const checkFatalityDone = choice => {
  if ( choice == randomFatalityHash[0] ) {		
    randomFatalityHash.splice( 0, 1 );
    if ( randomFatalityHash.length == 0 ) {
      postWinnerResultFatality( 'done' )
    }
  } else {
    postWinnerResultFatality( 'miss' )
  } 	 			   	
}
  
  
const postWinnerResultFatality = resultFatality => {
  client.postWinnerResultFatality( resultFatality, ( serverResult ) => {
    gameStatus = 'none'
    endFatality( serverResult )
  })
}
  
    
const loserWaitResultFatality = () => {
  client.loserWaitResultFatality(( serverResult ) => {
    if ( serverResult.fatality == 'none' ) {
      setTimeout( loserWaitResultFatality, 300 )
    } 
    if ( serverResult.fatality != 'none' ) {
      gameStatus = 'none'
      endFatality( serverResult )	
    }	      
  }) 
}  


const endFatality = serverResult => {		
  if ( timerEndFatality !== null )  {
    clearTimeout( timerEndFatality )
    timerEndFatality = null
  }
  $( '.buttonsChoice' ).hide();	
  stopAnimationWait();
  if ( serverResult ) {     
    if ( serverResult.winner == 'me' && serverResult.fatality == 'done' ) 	$('#info').append('<br/>Fatality #$%$$%%$ !!!!!!#@ !!!  <br/>');
    if ( serverResult.winner == 'me' && serverResult.fatality == 'miss' ) 	$('#info').append('<br/>Fatality Crach :(  <br/>');	
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'done' ) 	$('#info').append('<br/> BLOOOD MORE :< FATALITY DONE <br/>');
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'miss' ) 	$('#info').append('<br/> Fatality Miss  <br/>');
  }
  endBattle()
}
  

const endBattle = () => {
  $('#info').append('<br/>EndBattle<br/>');
  setTimeout( clearScreen, 2000 )
}
  
  
const clearScreen = () => {
  $('#info').html('')
  connectFirst() 
} 
 
  
  

/*********************************************;
 *  DRAW SCREEN FUNCTIONS
 *********************************************/
  
const line = '<br/>--------------------------------------------------------------<br/>'; 
let intervalAnimation = false; 
  
  
const startAnimationWait = () => {
    $('<div/>',{ 'id' : 'loadBar' }).appendTo('#info');	
    intervalAnimation = setInterval( waitProgress, 1000 );
}
  
  
const waitProgress = () => { 
    $('#loadBar').append('*');	
}
  
  
const stopAnimationWait = () => {
    clearInterval( intervalAnimation );
    $('#loadBar').remove();	
}
  
  
  
  
/*********************************************;
 *  INIT GAME
 *********************************************/
  
init()

