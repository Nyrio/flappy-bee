import * as ex from 'excalibur';
import { Player } from '../../actors/player/player';
import { GameSettings } from '../../gamesettings';

class GameScene extends ex.Scene {
    private player: Player;

    public onInitialize(engine: ex.Engine) {
        this.player = new Player(GameSettings.HEIGHT);
        this.add(this.player);

        
    }

    public onActivate() {}
    public onDeactivate() {}
}

export { GameScene };