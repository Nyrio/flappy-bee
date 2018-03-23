import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { Player } from '../../actors/player/player';
import { Pesticide } from '../../actors/obstacles/pesticide';
import { GameSettings } from '../../gamesettings';


class GameScene extends ex.Scene {
    public score: number;

    public player: Player;
    protected centerLabel: ex.Label;
    protected scoreLabel: ex.Label;    

    protected lastObstacleTime: number;
    protected lastObstacleY: number;

    public gameStarted: boolean;
    public gameOver: boolean;

    public ground: ex.Actor;

    public onInitialize(engine: ex.Engine) {
        this.score = 0;

        this.player = new Player(GameSettings.HEIGHT, this);
        this.add(this.player);
        this.player.z = 5;

        this.lastObstacleTime = GameSettings.TIME_INTERVAL;
        this.lastObstacleY = GameSettings.HEIGHT/2;

        this.centerLabel = new ex.Label("Click to start flying.", GameSettings.WIDTH/2, GameSettings.HEIGHT/2, "Arial");
        this.centerLabel.textAlign = ex.TextAlign.Center;
        this.centerLabel.baseAlign = ex.BaseAlign.Middle;
        this.centerLabel.fontSize = 42;
        this.centerLabel.color = ex.Color.White;
        this.add(this.centerLabel);
        this.centerLabel.z = 10;

        this.scoreLabel = new ex.Label("0", GameSettings.WIDTH-32, 32, "Arial");
        this.scoreLabel.textAlign = ex.TextAlign.Right;
        this.scoreLabel.baseAlign = ex.BaseAlign.Top;
        this.scoreLabel.fontSize = 42;
        this.scoreLabel.color = ex.Color.White;
        this.add(this.scoreLabel);
        this.scoreLabel.z = 10;

        this.gameStarted = false;
        this.gameOver = false;

        this.ground = new ex.Actor();
        this.ground.addDrawing(Resource.Ground.asSprite());
        this.ground.x = GameSettings.WIDTH/2;
        this.ground.y = GameSettings.HEIGHT - GameSettings.GROUND_HEIGHT/2;
        this.ground.setWidth(GameSettings.WIDTH);
        this.ground.setHeight(GameSettings.GROUND_HEIGHT);
        this.add(this.ground);
        this.ground.z = 10;

        engine.input.pointers.primary.on("down", this.onPress);

        this.camera.pos = new ex.Vector(GameSettings.WIDTH/2, GameSettings.HEIGHT/2);
    }

    public onPress = () => {
        if(!this.gameStarted) {
            this.gameStarted = true;
            this.centerLabel.visible = false;
        }

        if(this.gameOver) {

        }
    }

    public update(engine: ex.Engine, delta: number) {
        if(this.gameOver || !this.gameStarted)
            return;

        super.update(engine, delta); // call base update logic

        this.lastObstacleTime += delta/1000;

        if(this.lastObstacleTime > GameSettings.TIME_INTERVAL) {
            var posx = GameSettings.WIDTH + Math.floor(Math.random() * GameSettings.VARIABILITY);
            var spaceY = Math.floor(GameSettings.MAX_SPACE - (GameSettings.MAX_SPACE - GameSettings.MIN_SPACE) / GameSettings.SCORE_MAX_DIFF);
            var posy;
            do {
                posy = Math.floor(spaceY + Math.random() * (GameSettings.HEIGHT - GameSettings.GROUND_HEIGHT - 2*spaceY))
            } while(Math.abs(posy - this.lastObstacleY) > (GameSettings.START_V_LIMIT + (GameSettings.END_V_LIMIT - GameSettings.START_V_LIMIT) * this.score / GameSettings.SCORE_MAX_DIFF) * GameSettings.HEIGHT);
            //alert(posx + " " + posy + " " + spaceY);

            this.add(new Pesticide(posx, posy, spaceY, this));
            this.lastObstacleY = posy;
            this.lastObstacleTime = 0;
        }

        this.scoreLabel.text = this.score.toString();
    }

    public setGameOver = () => {
        this.gameOver = true;
        this.centerLabel.text = "Game Over"
        this.centerLabel.visible = true;
    }

    public onActivate() {}
    public onDeactivate() {}
}

export { GameScene };