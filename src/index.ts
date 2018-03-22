import * as ex from 'excalibur';
import { GameScene } from './scenes/gameScene/gamescene';
import { Player } from './actors/player/player';
import { Resource } from './resource';
import { GameSettings } from './gamesettings';

class Game extends ex.Engine {
    constructor() {
        super({ width: GameSettings.WIDTH,
                height: GameSettings.HEIGHT,
                displayMode: ex.DisplayMode.Fixed,
                pointerScope: ex.Input.PointerScope.Canvas });
    }

    public start(loader?: ex.ILoader) {
        return super.start(loader);
    }
}

var loader = new ex.Loader();
for(var resource in Resource){
    loader.addResource(Resource[resource]);
}

const game = new Game();
const gameScene = new GameScene();

gameScene.camera.pos = new ex.Vector(GameSettings.WIDTH/2, GameSettings.HEIGHT/2);
game.add('gameScene', gameScene);

game.start(loader).then(() => {
    game.goToScene('gameScene');
});
