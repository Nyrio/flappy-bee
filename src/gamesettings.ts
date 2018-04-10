export namespace GameSettings {
    // General display settings
    export const WIDTH = 800;
    export const HEIGHT = 600;

    // Physics of the game
    export const GRAVITY = 800;
    export const FORCE = -800;
    export const INERTIA = 0.3;
    export const HSPEED = 200;

    // Obstacle generation settings
    export const TIME_INTERVAL = 1.5;
    export const VARIABILITY = 100;
    export const MAX_SPACE = 180;
    export const MIN_SPACE = 100;
    export const SCORE_MAX_DIFF = 100;
    export const START_V_LIMIT = 0.2;
    export const END_V_LIMIT = 1;

    // Decor settings
    export const BG_TIME_INTERVAL = 30;
    export const BG_HSPEED = 80;
    export const BG_VARIABILITY = 300;

    // Size of some objects
    export const GROUND_HEIGHT = 64;
    export const PEST_HEIGHT = 512;
    export const PEST_WIDTH = 64;
}