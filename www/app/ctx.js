/***********************************************;
*  Project        : STONE
*  Program name   : Canvas draw
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game on phaser   
***********************************************/	

let h01 = null 

class Ctx {

  constructor() {


    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 1200,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      },
      scene: {
        preload: this.preload,
        create: this.create
      }
    }
    this.gm = new Phaser.Game( this.config )
  }
  
  preload() {  
    this.load.setBaseURL('app/imgs/')
    this.load.image( 'h01', 'h01.png' )
  }

  create() {  
    h01 = this.add.image(200, 150, 'h01')
    //h01.anchor.set(0.5)
  }
} 
