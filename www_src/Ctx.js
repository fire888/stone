
/*******************************************************************;
 *              _        *  Project        :  STONE
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  draw canvas
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


class Ctx {
 
  constructor() {
 
    this.renderer = new PIXI.CanvasRenderer( window.innerHeight, window.innerHeight )
    document.body.appendChild( this.renderer.view )
    this.renderer.view.style.margin = '0 auto'
    this.stage = new PIXI.Stage

    this.stepX = null  
    this.stepY = null
    this.reckonWindowSize()

    this.currentSpriteHero = null
    this.currentSpriteEnemy = null
  }


  reckonWindowSize() {
  
    this.stepY = window.innerHeight/20
    this.stepX = window.innerHeight/20
  }


  loadAssets( onInit ) {
  
    PIXI.loader
      .add( 'app/imgs/signs.json' )
      .add( 'app/imgs/fat01.json' )      
      .load(() => { 
        this.initAnimation( onInit ) 
      })
  }


  initAnimation( onInit ) {
    
    /** ANIMATION WAIT */

    let framesWait = []
    for ( let i = 1; i < 8; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesWait.push( PIXI.Texture.fromFrame( 'wait' + val + '.png' ) )
    }

    this.waitHero = new PIXI.extras.AnimatedSprite( framesWait )
    this.waitHero.x = this.stepX*10
    this.waitHero.y = this.stepY*12
    this.waitHero.anchor.set(0.5);
    this.waitHero.animationSpeed = 0.12;

    
    this.waitEnemy = new PIXI.extras.AnimatedSprite( framesWait );
    this.waitEnemy.x = this.stepX*10  
    this.waitEnemy.y = this.stepY*8
    this.waitEnemy.anchor.set(0.5);  
    this.waitEnemy.rotation = Math.PI
    this.waitEnemy.animationSpeed = 0.15;
  
    
    /** ANIMATION COMA */

    let framesComa = []
    for ( let  i = 1; i < 11; i ++ ) {
      let val = i < 10 ? '0' + i : i;
      framesComa.push( PIXI.Texture.fromFrame( 'coma' + val + '.png' ) )
    }

    this.comaHero = new PIXI.extras.AnimatedSprite( framesComa )
    this.comaHero.x = this.stepX*10
    this.comaHero.y = this.stepY*12
    this.comaHero.anchor.set( 0.5 )
    this.comaHero.animationSpeed = 0.12

    this.comaEnemy = new PIXI.extras.AnimatedSprite( framesComa )
    this.comaEnemy.x = this.stepX*10
    this.comaEnemy.y = this.stepY*8
    this.comaEnemy.anchor.set(0.5);
    this.comaEnemy.rotation = Math.PI  
    this.comaEnemy.animationSpeed = 0.12;
    

    /** ANIMATION KULAK */

    let framesKulak = []
    for ( let  i = 1; i < 7; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesKulak.push( PIXI.Texture.fromFrame( 'choice' + val + '.png' ) )
    }
    this.kulakHero = new PIXI.extras.AnimatedSprite( framesKulak )
    this.kulakHero.x = this.stepX*10
    this.kulakHero.y = this.stepY*12
    this.kulakHero.anchor.set( 0.5 )
    this.kulakHero.animationSpeed = 0.12

    this.kulakEnemy = new PIXI.extras.AnimatedSprite( framesKulak )
    this.kulakEnemy.x = this.stepX*10
    this.kulakEnemy.y = this.stepY*8
    this.kulakEnemy.anchor.set( 0.5 )  
    this.kulakEnemy.rotation = Math.PI
    this.kulakEnemy.animationSpeed = 0.12  
   

    /** ANIMATION STONE */

    let framesStone = []
    for ( let i = 1; i < 4; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesStone.push( PIXI.Texture.fromFrame( 'stone' + val + '.png' ) )
    }
    this.stoneHero = new PIXI.extras.AnimatedSprite( framesStone )
    this.stoneHero.x = this.stepX*10
    this.stoneHero.y = this.stepY*12
    this.stoneHero.anchor.set(0.5)
    this.stoneHero.animationSpeed = 0.05
    this.stoneHero.loop = false

    this.stoneEnemy = new PIXI.extras.AnimatedSprite( framesStone )
    this.stoneEnemy.x = this.stepX*10
    this.stoneEnemy.y = this.stepY*8
    this.stoneEnemy.anchor.set(0.5)
    this.stoneEnemy.rotation = Math.PI  
    this.stoneEnemy.animationSpeed = 0.05
    this.stoneEnemy.loop = false  
  

    /** ANIMATION PAPER */

    let framesPaper = []
    for ( let i = 2; i < 5; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesPaper.push( PIXI.Texture.fromFrame( 'paper' + val + '.png' ) )
    }
    this.paperHero = new PIXI.extras.AnimatedSprite( framesPaper )
    this.paperHero.x = this.stepX*10
    this.paperHero.y = this.stepY*12
    this.paperHero.anchor.set(0.5)
    this.paperHero.animationSpeed = 0.05
    this.paperHero.loop = false     

    this.paperEnemy = new PIXI.extras.AnimatedSprite( framesPaper )
    this.paperEnemy.x = this.stepX*10
    this.paperEnemy.y = this.stepY*8
    this.paperEnemy.anchor.set(0.5)
    this.paperEnemy.rotation = Math.PI     
    this.paperEnemy.animationSpeed = 0.05 
    this.paperEnemy.loop = false        


    /** ANIMATION SCISSORS */
    
    let framesScissors = []
    for ( let i = 2; i < 5; i ++ ) {
      let val = i < 10 ? '0' + i : i;
      framesScissors.push( PIXI.Texture.fromFrame( 'scissors' + val + '.png' ) )
    }
    this.scissorsHero = new PIXI.extras.AnimatedSprite( framesScissors )
    this.scissorsHero.x = this.stepX*10
    this.scissorsHero.y = this.stepY*12
    this.scissorsHero.anchor.set(0.5)
    this.scissorsHero.animationSpeed = 0.05
    this.scissorsHero.loop = false    

    this.scissorsEnemy = new PIXI.extras.AnimatedSprite( framesScissors )
    this.scissorsEnemy.x = this.stepX*10
    this.scissorsEnemy.y = this.stepY*8
    this.scissorsEnemy.anchor.set(0.5)
    this.scissorsEnemy.rotation = Math.PI   
    this.scissorsEnemy.animationSpeed = 0.05  
    this.scissorsEnemy.loop = false  


    /** ANIMATION SIGNS */
  
    let goodSignFrame = []
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign00.png' ) )    
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign01.png' ) )
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign05.png' ) )
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign06.png' ) )
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign07.png' ) ) 
    goodSignFrame.push( PIXI.Texture.fromFrame( 'sign08.png' ) )   
              
    this.signHeroGood = new PIXI.extras.AnimatedSprite( goodSignFrame )
    this.signHeroGood.x = this.stepX*10
    this.signHeroGood.y = this.stepY*12
    this.signHeroGood.anchor.set( 0.5 )
    this.signHeroGood.animationSpeed = 0 
    this.signHeroGood.loop = false     

    this.signEnemyGood = new PIXI.extras.AnimatedSprite( goodSignFrame )
    this.signEnemyGood.x = this.stepX*10
    this.signEnemyGood.y = this.stepY*8
    this.signEnemyGood.anchor.set( 0.5 )
    this.signEnemyGood.rotation = Math.PI     
    this.signEnemyGood.animationSpeed = 0
    this.signEnemyGood.loop = false   

    let badSignFrame = []  
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign02.png' ) ) 
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign03.png' ) )     
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign04.png' ) ) 
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign09.png' ) )
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign10.png' ) )       
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign11.png' ) )  
    badSignFrame.push( PIXI.Texture.fromFrame( 'sign12.png' ) ) 

    this.signHeroBad = new PIXI.extras.AnimatedSprite( badSignFrame )
    this.signHeroBad.x = this.stepX*10
    this.signHeroBad.y = this.stepY*12
    this.signHeroBad.anchor.set( 0.5 )
    this.signHeroBad.animationSpeed = 0 
    this.signHeroBad.loop = false     

    this.signEnemyBad = new PIXI.extras.AnimatedSprite( badSignFrame )
    this.signEnemyBad.x = this.stepX*10
    this.signEnemyBad.y = this.stepY*8
    this.signEnemyBad.anchor.set( 0.5 )
    this.signEnemyBad.rotation = Math.PI     
    this.signEnemyBad.animationSpeed = 0
    this.signEnemyBad.loop = false       


    /** ANIMATION FATALITY */

    let framesFatality = []
    for ( let i = 0; i < 8; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesFatality.push( PIXI.Texture.fromFrame( 'fat01_' + val + '.png' ) )
    }
    this.fatality = new PIXI.extras.AnimatedSprite( framesFatality )
    this.fatality.x = this.stepX*10
    this.fatality.y = this.stepY*10
    this.fatality.anchor.set( 0.5 )
    this.fatality.animationSpeed = 0.05
    this.fatality.loop = false   

    onInit()
  }


  /** FUNCTIONS PREPEAR GAME ***************************************/

  setStartSign() {
   
    this.signHeroGood.gotoAndStop(0)
    this.signHeroGood.x = this.stepX*10
    this.signHeroGood.y = this.stepY*12  
    this.stage.addChild( this.signHeroGood )
  }


  removeStartSign() {
  
    this.stage.removeChild( this.signHeroGood )   
  }


  startAnimationWait( hero, enemy ) {

    if ( hero ) {
      this.waitHero.play()
      this.stage.addChild( this.waitHero )
    }
    
    if ( enemy ) {
      this.waitEnemy.play()
      this.stage.addChild( this.waitEnemy )      
    }
  }


  removeAnimationWait( hero, enemy ) {
    
    if ( hero ) {
      this.waitHero.stop()
      this.stage.removeChild( this.waitHero )
    }

    if ( enemy ) {
      this.waitEnemy.stop()
      this.stage.removeChild( this.waitEnemy )    
    }
  }  


  prepearCanvasToFight( canvasReady ) {

    this.addGoodSign( true, true )
    setTimeout( () => { 
        this.canvasReadyToFight( canvasReady ) 
      }, 1500 )
  }  


  canvasReadyToFight( canvasReady ) {

    this.removeGoodSign( true, true )  
    canvasReady()
  }


  addGoodSign( hero, enemy ) {

    if ( hero ) {
      this.signHeroGood.gotoAndStop( Math.floor( Math.random()*4 + 1 ) )      
      this.stage.addChild( this.signHeroGood )
    }
    if ( enemy ) {
      this.signEnemyGood.gotoAndStop( Math.floor( Math.random()*4 + 1 ) )      
      this.stage.addChild( this.signEnemyGood )      
    }
  }


  removeGoodSign( hero, enemy ) {

    if ( hero ) {
      this.stage.removeChild( this.signHeroGood )
    }
    if ( enemy ) {
      this.stage.removeChild( this.signEnemyGood )      
    }
  }


  addBadSign( hero, enemy ) {

    if ( hero ) {
      this.signHeroBad.gotoAndStop( Math.floor( Math.random()*7 ) )      
      this.stage.addChild( this.signHeroBad )
    }
    if ( enemy ) {
      this.signEnemyBad.gotoAndStop( Math.floor( Math.random()*7 ) )      
      this.stage.addChild( this.signEnemyBad )      
    }
  }


  removeBadSign( hero, enemy ) {

    if ( hero ) {
      this.stage.removeChild( this.signHeroBad )
    }
    if ( enemy ) {
      this.stage.removeChild( this.signEnemyBad )      
    }
  }  



  /** FUNCTIONS ROUND **********************************************/

  startAnimationKulak( hero, enemy ) {
  
    if ( hero ) {
      this.kulakHero.play()
      this.stage.addChild( this.kulakHero )    
    }
    if ( enemy ) {
      this.kulakEnemy.play()
      this.stage.addChild( this.kulakEnemy )    
    }    
  } 


  stopAnimationKulak( hero, enemy ) {
  
    if ( hero ) {
      this.kulakHero.gotoAndStop( 5 )    
    }
    if ( enemy ) {
      this.kulakEnemy.gotoAndStop( 5 )     
    }    
  }


  removeAnimationKulak( hero, enemy ) {
  
    if ( hero ) {
      this.stage.removeChild( this.kulakHero )  
    }
    if ( enemy ) {
      this.stage.removeChild( this.kulakEnemy )
    }    
  }
  
  
  drawPlayersChoices( choices ) {
    
    this.removeAnimationKulak( true, true )
    
    this.currentSpriteHero = this.getSprite( true, false, choices.myChoice )
    this.stage.addChild( this.currentSpriteHero )    
    if ( this.isSpritePlay( choices.myChoice ) ) { 
      this.currentSpriteHero.play()
    } else {
      this.currentSpriteHero.gotoAndStop(1)      
    } 
    
    this.currentSpriteEnemy = this.getSprite( false, true, choices.enemyChoice )
    this.stage.addChild( this.currentSpriteEnemy ) 
    if ( this.isSpritePlay( choices.enemyChoice ) ) { 
      this.currentSpriteEnemy.play()
    } else {
      this.currentSpriteEnemy.gotoAndStop(1)      
    }           
  }


  getSprite( hero, enemy, choice ) {
  
    let sp = null
  
    if ( hero ) {
      if ( choice == 'stone' ) sp = this.stoneHero 
      if ( choice == 'paper' ) sp = this.paperHero 
      if ( choice == 'scissors' ) sp = this.scissorsHero 
      if ( choice == 'timeout' ) sp = this.signHeroBad 
    }
    if ( enemy ) {
      if ( choice == 'stone' ) sp = this.stoneEnemy
      if ( choice == 'paper' ) sp = this.paperEnemy 
      if ( choice == 'scissors' ) sp = this.scissorsEnemy 
      if ( choice == 'timeout' ) sp = this.signEnemyBad 
    }

    return sp
  }


  isSpritePlay( choice ) {

    if ( choice == 'timeout' ) {
      return false
    }
    return true
  }


  removePlayersChoices() {

    this.stage.removeChild( this.currentSpriteHero )
    this.stage.removeChild( this.currentSpriteEnemy )    
  }


  /** FUNCTIONS FATALITY *******************************************/  

  startAnimationComa( hero, enemy ) {

    if ( hero ) {
      this.comaHero.play()
      this.stage.addChild( this.comaHero )
    }
    
    if ( enemy ) {
      this.comaEnemy.play()
      this.stage.addChild( this.comaEnemy )      
    }
  }


  stopAnimationComa( hero, enemy ) {
    
    if ( hero ) {
      this.comaHero.stop()
      this.stage.removeChild( this.comaHero )
    }

    if ( enemy ) {
      this.comaEnemy.stop()
      this.stage.removeChild( this.comaEnemy )    
    }
  }


  startAnimationFatality( noRotation ) {

    noRotation ? this.fatality.rotation = 0  : this.fatality.rotation = Math.PI
    this.stage.addChild( this.fatality ) 
    this.fatality.gotoAndPlay( 0 )
  }


  removeAnimationFatality() {

    this.stage.removeChild( this.fatality )     
  } 


  /** DRAW EVERY FRAME ***********************************************/

  drawFrame() { 

    this.renderer.render( this.stage )
    requestAnimationFrame(() => { 
      this.drawFrame() 
    })
  }
}   


export default Ctx


