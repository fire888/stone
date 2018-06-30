
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

let renderer


class Ctx {
 
  constructor() {
    renderer = new PIXI.CanvasRenderer( window.innerHeight*0.6, window.innerHeight )
    document.body.appendChild( renderer.view )
    renderer.view.id = 'ctx'    
    this.stage = new PIXI.Stage

    this.step = null  
    this.scale = null

    this.currentSpriteHero = null
    this.currentSpriteEnemy = null

    this.reckonWindowSize()
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

    let posXHero = this.step*6 
    let posYHero = this.step*11
    let posXEnemy = this.step*5
    let posYEnemy = this.step*7 
    
    /** ANIMATION WAIT */

    let framesWait = []
    for ( let i = 1; i < 8; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesWait.push( PIXI.Texture.fromFrame( 'wait' + val + '.png' ) )
    }

    this.waitHero = new PIXI.extras.AnimatedSprite( framesWait )
    this.waitHero.x = posXHero
    this.waitHero.y = posYHero
    this.waitHero.scale.set( this.scale, this.scale )
    this.waitHero.anchor.set( 0.5 )
    this.waitHero.animationSpeed = 0.12

    
    this.waitEnemy = new PIXI.extras.AnimatedSprite( framesWait );
    this.waitEnemy.x = posXEnemy
    this.waitEnemy.y = posYEnemy
    this.waitEnemy.scale.set( this.scale, this.scale )
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
    this.comaHero.x = posXHero
    this.comaHero.y = posYHero
    this.comaHero.scale.set( this.scale, this.scale )
    this.comaHero.anchor.set( 0.5 )
    this.comaHero.animationSpeed = 0.12

    this.comaEnemy = new PIXI.extras.AnimatedSprite( framesComa )
    this.comaEnemy.x = posXEnemy
    this.comaEnemy.y = posYEnemy
    this.comaEnemy.scale.set( this.scale, this.scale )
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
    this.kulakHero.x = posXHero
    this.kulakHero.y = posYHero
    this.kulakHero.scale.set( this.scale, this.scale )
    this.kulakHero.anchor.set( 0.5 )
    this.kulakHero.animationSpeed = 0.12

    this.kulakEnemy = new PIXI.extras.AnimatedSprite( framesKulak )
    this.kulakEnemy.x = posXEnemy
    this.kulakEnemy.y = posYEnemy
    this.kulakEnemy.scale.set( this.scale, this.scale )
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
    this.stoneHero.x = posXHero
    this.stoneHero.y = posYHero
    this.stoneHero.scale.set( this.scale, this.scale )
    this.stoneHero.anchor.set(0.5)
    this.stoneHero.animationSpeed = 0.05
    this.stoneHero.loop = false

    this.stoneEnemy = new PIXI.extras.AnimatedSprite( framesStone )
    this.stoneEnemy.x = posXEnemy
    this.stoneEnemy.y = posYEnemy
    this.stoneEnemy.scale.set( this.scale, this.scale )
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
    this.paperHero.x = posXHero
    this.paperHero.y = posYHero
    this.paperHero.scale.set( this.scale, this.scale )
    this.paperHero.anchor.set(0.5)
    this.paperHero.animationSpeed = 0.05
    this.paperHero.loop = false     

    this.paperEnemy = new PIXI.extras.AnimatedSprite( framesPaper )
    this.paperEnemy.x = posXEnemy
    this.paperEnemy.y = posYEnemy
    this.paperEnemy.scale.set( this.scale, this.scale )
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
    this.scissorsHero.x = posXHero
    this.scissorsHero.y = posYHero
    this.scissorsHero.scale.set( this.scale, this.scale )
    this.scissorsHero.anchor.set(0.5)
    this.scissorsHero.animationSpeed = 0.05
    this.scissorsHero.loop = false    

    this.scissorsEnemy = new PIXI.extras.AnimatedSprite( framesScissors )
    this.scissorsEnemy.x = posXEnemy
    this.scissorsEnemy.y = posYEnemy
    this.scissorsEnemy.scale.set( this.scale, this.scale )
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
    this.signHeroGood.x = posXHero 
    this.signHeroGood.y = posYHero
    this.signHeroGood.scale.set( this.scale, this.scale )
    this.signHeroGood.anchor.set( 0.5 )
    this.signHeroGood.animationSpeed = 0 
    this.signHeroGood.loop = false     

    this.signEnemyGood = new PIXI.extras.AnimatedSprite( goodSignFrame )
    this.signEnemyGood.x = posXEnemy
    this.signEnemyGood.y = posYEnemy
    this.signEnemyGood.anchor.set( 0.5 )
    this.signEnemyGood.scale.set( this.scale, this.scale )
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
    this.signHeroBad.x = posXHero
    this.signHeroBad.y = posYHero
    this.signHeroBad.scale.set( this.scale, this.scale )
    this.signHeroBad.anchor.set( 0.5 )
    this.signHeroBad.animationSpeed = 0 
    this.signHeroBad.loop = false     

    this.signEnemyBad = new PIXI.extras.AnimatedSprite( badSignFrame )
    this.signEnemyBad.x = posXEnemy
    this.signEnemyBad.y = posYEnemy
    this.signEnemyBad.scale.set( this.scale, this.scale )
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
    this.fatality.x = this.step*5
    this.fatality.y = this.step*10
    this.fatality.scale.set( this.scale, this.scale )
    this.fatality.anchor.set( 0.5 )
    this.fatality.animationSpeed = 0.05
    this.fatality.loop = false   
    
    this.reckonWindowSize()

    onInit()
  }

  reckonWindowSize() {
    let l = window.innerHeight*0.6 
    let h = window.innerHeight 
    renderer.view.style.height = l 
    renderer.view.style.width = h 
    renderer.resize( l, h )  

    this.step = h/20
    this.scale = h/1000*0.92

    if ( ! this.waitHero ) return  

    let posXHero = this.step*6 
    let posYHero = this.step*11
    let posXEnemy = this.step*5
    let posYEnemy = this.step*7 

    setSpriteXYScale( this.waitHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.waitEnemy, posXEnemy, posYEnemy, this.scale )  
    setSpriteXYScale( this.comaHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.comaEnemy, posXEnemy, posYEnemy, this.scale )
    setSpriteXYScale( this.kulakHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.kulakEnemy, posXEnemy, posYEnemy, this.scale ) 
    setSpriteXYScale( this.stoneHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.stoneEnemy , posXEnemy, posYEnemy, this.scale ) 
    setSpriteXYScale( this.scissorsHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.scissorsEnemy, posXEnemy, posYEnemy, this.scale )    
    setSpriteXYScale( this.paperHero, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.paperEnemy, posXEnemy, posYEnemy, this.scale ) 
    setSpriteXYScale( this.signHeroGood, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.signEnemyGood, posXEnemy, posYEnemy, this.scale )         
    setSpriteXYScale( this.signHeroBad, posXHero, posYHero, this.scale )
    setSpriteXYScale( this.signEnemyBad, posXEnemy, posYEnemy, this.scale )  
    
    setSpriteXYScale( this.fatality, this.step*5, this.step*10, this.scale )        
    
  }  


  /** FUNCTIONS PREPEAR GAME ***************************************/

  setStartSign() {
   
    this.signHeroGood.gotoAndStop(0)
    this.signHeroGood.x = this.step*6
    this.signHeroGood.y = this.step*11
    this.signHeroGood.scale.set( this.scale, this.scale )
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
      this.signHeroGood.x = this.step*6  
      this.signHeroGood.y = this.step*11
      this.signHeroGood.scale.set( this.scale, this.scale )         
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

    renderer.render( this.stage )
    requestAnimationFrame(() => { 
      this.drawFrame() 
    })
  }
}  


const setSpriteXYScale = ( ob, x, y, sc ) => {
  ob.x = x
  ob.y = y
  ob.scale.set( sc, sc ) 
}


export default Ctx


