
/*******************************************************************;
 *              _        *  Project        :  STONE    
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  main
 *    __/_ \  \/_/ \     * -----------------------------------------;
 *   /\___\ \_______\    *  Author         :  www.otrisovano.ru
 *   \/___/ /  __   /    * -----------------------------------------;
 *      \  /  /\ \ /     *  Date           :  01.11.2017 
 *       \/___\ \_\      * -----------------------------------------;
 *             \/_/      *  Purpose        :  game 2d
 *                       * -----------------------------------------;
 *                       *  License        :  MIT         
 *******************************************************************/


'use strict' 


/** IMPORT *********************************************************/ 


import Ui from './Ui' 
import Client from './Client'
import Ctx from './Ctx'

const ui     = new Ui()
const client = new Client()
const ctx    = new Ctx()


/** GAME VARS ******************************************************/


let intervalListenChoiceEnemy = null,
timerRound                    = null,
timerUpdateGameResult         = null,
timerEndFatality              = null,
gameStatus                    = 'none', // play | made-choice-and-wait | wait-choice-fatality | fatality
randomFatalityHash            = null,

gooutBrowserTime              = null       

/** INIT GAME ******************************************************/


const init = () => {

  return new Promise(( resolve ) => {
      ctx.loadAssets( resolve )
  })
  .then(() => {
    return new Promise(( resolve ) => { 
      ui.init()    
      ctx.drawFrame()
      ctx.setStartSign() 
      initButtonSearchEnemy()         
      initButtonsChoiceHero()
      initErrorConnection()
      initGooutBrowserTabError()                           
      resolve()
    })
  })
  .then(() => {
    if ( removeStartLoader ) removeStartLoader()
    initStartButton()
    connectFirst()
  })
}
  

const initErrorConnection = () => {

  client.setFunctionResponseError( () => {
    ui.setMessage( 'GAME DISCONNECTED' )
    clearErrorScreen()
  })
}


const initGooutBrowserTabError = () => {
  
  window.onblur = () => {
    if ( gameStatus != 'play' || gameStatus != 'made-choice-and-wait' ) return
    gooutBrowserTime = new Date()
  }
  window.onfocus = function () {
    if ( gooutBrowserTime == null ) return
    if ( new Date() - gooutBrowserTime > 200000 ) {
      gooutBrowserTime = null
      clearErrorScreen()
      ctx.setStartSign() 
      ui.showButtonSearch()      
    } 
  }
}


const clearErrorScreen = () => {

  ctx.removeBadSign( true, true ) 
  ctx.removeGoodSign( true, true )
  ctx.removeAnimationKulak( true, true )
  ctx.removeAnimationWait( true, true )  
  ctx.removePlayersChoices()    
  ctx.removeAnimationFatality()
  ui.hideButtonsChoice()
  clearAllTimers()       
  endBattle()      
}


const initStartButton = () => {

  ui.initStartButton(() => { 
    if ( removeStartScreen ) removeStartScreen()
    ui.showButtonSearch() 
  })
} 


const initButtonSearchEnemy = () => {

  ui.clickButtonSearchEnemy(() => {
    ctx.removeGoodSign( true, false )
    ctx.removeBadSign( true, false )  
    ctx.removeAnimationFatality()
    ctx.removeStartSign()
    ctx.startAnimationWait( true, false )
    ui.clearScreen()
    apiFindEnemy()
  })       
}  
  
  
const initButtonsChoiceHero = () => {

  ui.clickButtonsChoiceHero( 
    ( e ) => {
      if ( buttonsNotBlock() ) {	
        gameStatus = 'made-choice-and-wait' 
        sendHeroChoice( e.target.value )
        return 
      }   
      checkFatalityDone( e.target.value )        		
    }, 
    buttonsNotBlock
  )     
}  
    
    
/** START FUNCTIONS ************************************************/


const connectFirst = () => {
  
  client.getSignIfConnectFirst(( serverResult ) => {
    ui.setConnectionMessage( serverResult.name )
  })
}
    
  
const apiFindEnemy = () => {

  client.sendSignToFindEnemy(( serverResult ) => {
    if ( serverResult.state === 'playing' ) { 
      gameStatus = 'play'
      meetingPlayers()					
    } else { 
      setTimeout( apiFindEnemy, 500 ); 
    }      
  })
}
    
    
const meetingPlayers = () => {

  client.getSignAboutUpdateGameResult(( serverResult ) => {
    ui.setMessageSearchEnemy( serverResult.enemy.name )
    ctx.removeAnimationWait( true, false )
    ctx.prepearCanvasToFight( () => { 
      startRound()
    })	    
  }) 
}


/** FUNCTIONS PLAY ROUND *******************************************/


const startRound = () => {

  gameStatus = 'play'
  ui.hideButtonSearch()
  ui.startAnimationRoundTimer( 7000 )
  ui.redrawChoiceButtons( 'show' )
  ui.showButtonsChoice()  
  ctx.startAnimationKulak( true, true )

  intervalListenChoiceEnemy = setInterval( waitEnemyChoice, 1000 )
  timerRound = setTimeout( endTimerRound, 7000 )		
}
    
  
const waitEnemyChoice = () => {

  client.getSignAboutUpdateGameResult(( serverResult ) => {

    if ( serverResult.enemyMadeChoice ) {	
      ctx.stopAnimationKulak( false, true )
      clearInterval( intervalListenChoiceEnemy )		
    }
  })
}		
    
    
const sendHeroChoice = ( choice ) => {

  ctx.stopAnimationKulak( true, false )
  client.sendHeroChoice( choice, ( serverResult ) => {
    updateGameResult( serverResult )
  }) 
}	 


const buttonsNotBlock = () => {

  if ( gameStatus == 'made-choice-and-wait' ) return false
  if (  gameStatus == 'wait-choice-fatality' ) return false
  return true
} 


const endTimerRound = () => {  
  
  clearInterval( intervalListenChoiceEnemy )
  client.sendHeroChoice( 'timeout', ( serverResult ) => {
    updateGameResult( serverResult )
  })
}


const updateGameResult = ( serverResult ) => {	 
 
  if ( serverResult.state == 'oneOfPlayersDisconnected' ) {
    clearAllTimers()
    drawEnemyDisconnection()
    return
  }
  if ( serverResult.enemyMadeChoice ) {	
    clearAllTimers()

    ui.drawRoundResult( serverResult.results[ serverResult.results.length-1 ] )       
    ctx.drawPlayersChoices( serverResult.results[ serverResult.results.length-1 ] )

    setTimeout( nextRound, 4000 )
  } else {
    timerUpdateGameResult = setTimeout( () => {
      client.getSignAboutUpdateGameResult(( serverResult ) => {
        updateGameResult( serverResult )
      })            				
    }, 500 )
  }  
}


const clearAllTimers = () => {
  
  clearInterval( intervalListenChoiceEnemy )
  intervalListenChoiceEnemy = null    
  clearTimeout( timerUpdateGameResult )
  timerUpdateGameResult = null    
  clearTimeout( timerRound )
  timerRound = null        
} 


const nextRound = () => {
  
  client.sendReadyForNextRound(( serverResult ) => {
    clearAllTimers()  
    ctx.removePlayersChoices()
    ui.redrawChoiceButtons( 'show' )    
    if ( serverResult.state === 'play' || serverResult.state === 'wait_ready' ) {
      startRound()
      return		
    }
    if ( serverResult.state === 'wait_fatality') { 
      startFatality( serverResult )
      return 
    }     
    if ( serverResult.state === 'over' || serverResult.state === 'fatality' ) {
      endBattle()
      return
    }
  })
}

  
/** FUNCTIONS END GAME *********************************************/


const drawEnemyDisconnection = () => {

  client.postEnemyIsDisconnected()
  ui.setMessage('ENEMY RUN FROM BATTLE<br/>You WIN !')
  ui.hideButtonsChoice()
  ctx.stopAnimationKulak( true, true )
  ctx.removeAnimationKulak( true, true )  
  ctx.removePlayersChoices()  
  ctx.addGoodSign( true, false )    
  endBattle()   
} 


const startFatality = ( serverResult ) => {
  
  gameStatus = 'wait-choice-fatality'
  if ( serverResult.winner === 'me' ) {
    
    ui.setMessageStartFatality( 'me' )
    ui.showButtonsChoice()
    ctx.startAnimationWait( true, false )
    ctx.startAnimationComa( false, true )
    
    makeHashFatality()

    timerEndFatality = setTimeout( () => { 
      postWinnerResultFatality( 'miss' ) 
    }, 8000 )    
  }
  if ( serverResult.winner === 'enemy' ) {

    ui.hideButtonsChoice()  
    ui.setMessageStartFatality( 'enemy' )
    ctx.startAnimationWait( false, true )
    ctx.startAnimationComa( true, false )  
    
    loserWaitResultFatality()

    timerEndFatality = setTimeout( () => { endFatality() }, 14000 )    
  }
}
  
  
const makeHashFatality = () => {

  randomFatalityHash = []
  for ( let i = 0; i < 5; i ++ ) {
    let n = Math.floor( Math.random()*3 )
    if ( n == 0 ) { setValueInHash( 'stone' ) }
    if ( n == 1 ) { setValueInHash( 'scissors' ) }
    if ( n == 2 ) { setValueInHash( 'paper' )	}					
  }
}


const setValueInHash = value => {

  randomFatalityHash.push( value )
  ui.addValueFatality( value ) 
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
    endFatality( serverResult )
  })
}
  
    
const loserWaitResultFatality = () => {

  client.loserWaitResultFatality(( serverResult ) => {
    if ( serverResult.fatality == 'none' ) {
      setTimeout( loserWaitResultFatality, 300 )
    } 
    if ( serverResult.fatality != 'none' ) {
      endFatality( serverResult )	
    }	      
  }) 
}  


const endFatality = serverResult => {

  if ( timerEndFatality !== null ) {
    clearTimeout( timerEndFatality )
    timerEndFatality = null     
  }
  ctx.removeAnimationWait( true, true )
  ctx.stopAnimationComa( true, true )
  ui.hideButtonsChoice()
  if ( serverResult ) {     
    if ( serverResult.winner == 'me' && serverResult.fatality == 'done' ) {
      ctx.startAnimationFatality( true )
    }
    if ( serverResult.winner == 'me' && serverResult.fatality == 'miss' ) {
      ctx.addBadSign( true, false )
      ctx.addGoodSign( false, true )      
    }  
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'done' ) { 
      ctx.startAnimationFatality( false )      
    }    
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'miss' ) {      
      ctx.addBadSign( false, true )
      ctx.addGoodSign( true, false )       
    }
  }
  if ( ! serverResult ) {
     ctx.addBadSign( false, true )
     ctx.addGoodSign( true, false )        
  }
  ui.removeFatalityBar()
  endBattle()  
}
  

const endBattle = () => setTimeout( clearEnemyFromScreen, 2000 ) 
  
  
const clearEnemyFromScreen = () => {

  gameStatus = 'none'
  ctx.removeGoodSign( false, true )
  ctx.removeBadSign( false, true )
  ui.showButtonSearch()  
  connectFirst() 
} 

/** RESIZE WIDDOW **************************************************/

const reckonWindowSize = () => {
  ctx.reckonWindowSize()
  ui.resizeUi()
}

window.addEventListener( 'resize', reckonWindowSize, false )

/** START INIT *****************************************************/


init()


