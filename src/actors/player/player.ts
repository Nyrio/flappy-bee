import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { GameSettings } from '../../gamesettings';

class Player extends ex.Actor {
    public ypos: number;
    public yspeed: number;
    public yacc: number;
    protected pressed: boolean;
    public flapAnimation: ex.Animation;

    constructor(sHeight: number) {
        super();

        this.setWidth(25);
        this.setHeight(25);
        this.x = 100;
        this.color = new ex.Color(255, 255, 255);

        this.ypos = sHeight/2;
        this.yspeed = 0;
        this.yacc = GameSettings.GRAVITY;
        this.pressed = false;

        this.y = this.ypos;
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

    public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta); // call base update logic

      if(this.pressed) {
          this.yspeed = GameSettings.FORCE;
          this.setDrawing("flap");
      }
      else
          this.yspeed = GameSettings.INERTIA * this.yspeed
                      + (1-GameSettings.INERTIA) * GameSettings.GRAVITY;

      this.ypos += this.yspeed * delta/1000;
      this.y = this.ypos;
      this.rotation = Math.max(-0.3, Math.min(0.3, Math.atan2(this.yspeed, GameSettings.HSPEED)));

      this.pressed = false;

      if(this.flapAnimation.isDone())
          this.setDrawing("idle");
   }
}

export { Player };