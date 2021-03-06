import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { GameSettings } from '../../gamesettings';
import { GameScene } from '../../scenes/gameScene/gamescene';


// This class handles the player animation and movement.
// It listens to clicks on the canvas to detect player input.
class Player extends ex.Actor {

    public ypos: number;
    public yspeed: number;
    public yacc: number;
    protected pressed: boolean;
    public flapAnimation: ex.Animation;
    protected gameScene: GameScene;

    constructor(scene: GameScene) {
        super();

        this.setWidth(42);
        this.setHeight(32);
        this.x = 100;

        this.ypos = GameSettings.HEIGHT/2;
        this.yspeed = 0;
        this.yacc = GameSettings.GRAVITY;
        this.pressed = false;
        this.y = this.ypos;

        this.gameScene = scene;
    }

    public onInitialize(engine: ex.Engine) {
        this.addDrawing("idle", new ex.Sprite(Resource.TxPlayer, 0, 0, 64, 64));
        this.setDrawing("idle");

        const playerIdleSheet = new ex.SpriteSheet(Resource.TxPlayer, 16, 1, 64, 64);
        this.flapAnimation = playerIdleSheet.getAnimationBetween(engine, 1, 16, 3);
        this.flapAnimation.loop = false;
        this.addDrawing("flap", this.flapAnimation);

        engine.input.pointers.primary.on("down", this.onPress);
    }

    public onPress = () => {
        this.pressed = true;
    }

    // reset the player state when starting a new game
    public reset = () => {
        this.ypos = GameSettings.HEIGHT/2;
        this.yspeed = 0;
        this.yacc = GameSettings.GRAVITY;
        this.pressed = false;
        this.y = this.ypos;
        this.rotation = 0;
    }


    public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta); // call base update logic

      // doing nothing is the game is not active
      if(this.gameScene.gameOver || !this.gameScene.gameStarted)
          return;

      // taking input into account
      if(this.pressed) {
          this.yspeed = GameSettings.FORCE;
          this.setDrawing("flap");
      }
      else
          this.yspeed = GameSettings.GRAVITY + (this.yspeed - GameSettings.GRAVITY) * (Math.exp(-delta/(1000*GameSettings.INERTIA)));

      this.ypos += this.yspeed * delta/1000;
      this.y = this.ypos;
      this.rotation = this.yspeed < 300 ? -0.3 : (this.yspeed > 600 ? 0.3 : -0.9 + 0.002 * this.yspeed);

      this.pressed = false;

      if(this.flapAnimation.isDone())
          this.setDrawing("idle");


      if(this.collides(this.gameScene.ground) != null || this.y < -100)
         this.gameScene.setGameOver();
   }
}

export { Player };