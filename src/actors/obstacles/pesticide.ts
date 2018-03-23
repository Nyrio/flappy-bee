import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { GameSettings } from '../../gamesettings';
import { GameScene } from '../../scenes/gameScene/gamescene';

class Pesticide extends ex.Actor {
    protected topPart: ex.Actor;
    protected bottomPart: ex.Actor;
    protected gameScene: GameScene;
    protected passed: boolean;

    constructor(xi: number, yi: number, ySpace: number, scene: GameScene) {
        super();

        this.x = xi;
        this.setWidth(GameSettings.PEST_WIDTH);
        this.setHeight(ySpace + 2 * GameSettings.PEST_HEIGHT);

        this.topPart = new ex.Actor();
        var topSprite = Resource.pesticide1.asSprite();
        topSprite.flipVertical = true;
        this.topPart.addDrawing(topSprite);
        this.topPart.x = 0;
        this.topPart.y = yi - (GameSettings.PEST_HEIGHT + ySpace) / 2;
        this.topPart.setWidth(GameSettings.PEST_WIDTH);
        this.topPart.setHeight(GameSettings.PEST_HEIGHT);
        this.add(this.topPart);

        this.bottomPart = new ex.Actor();
        this.bottomPart.addDrawing(Resource.pesticide2.asSprite());
        this.bottomPart.x = 0;
        this.bottomPart.y = yi + (GameSettings.PEST_HEIGHT + ySpace) / 2;
        this.bottomPart.setWidth(GameSettings.PEST_WIDTH);
        this.bottomPart.setHeight(GameSettings.PEST_HEIGHT);
        this.add(this.bottomPart);

        this.gameScene = scene;
        this.passed = false;
    }

    public onInitialize(engine: ex.Engine) {
        // do stuff
    }

    public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta); // call base update logic

      this.x -= GameSettings.HSPEED * delta/1000;

      if(this.topPart.collides(this.gameScene.player) != null || this.bottomPart.collides(this.gameScene.player) != null)
         this.gameScene.setGameOver();

      if(this.x < GameSettings.PEST_WIDTH/2) {
          if(!this.passed) {
              this.passed = true;
              this.gameScene.score++;
          }

          if(this.x < -GameSettings.PEST_WIDTH/2) {
              this.kill();
          }
      }
   }
}

export { Pesticide };