import { BaseScene } from "./base.js";
import './interactive/factory.js';  // This has to run before the first scene in order to add the commands

import TilesetImage from "../assets/tilesets/tileset_extruded.png";
import TilesetImage2 from "../assets/tilesets/tileset.png";
import Welcome from "../assets/maps/welcome_v.json";
import Player from "../assets/atlas/player.json";
import PlayerImg from "../assets/atlas/player.png";

export default class WelcomeScene extends BaseScene {

    constructor() {
        super('WelcomeScene');
    }

    preload() {
        // The keys have to be unique! Otherwise they will not be preloaded again.
        this.load.image("TilesetImage", TilesetImage);
        this.load.tilemapTiledJSON("WelcomeMap", Welcome);
        this.load.atlas("atlas", PlayerImg, Player);
    }

    create() {
        super.create("WelcomeMap");

        // Resize the world and camera bounds
        this.physics.world.setBounds(0, 0, 1920, 1088);
        this.cameras.main.setBounds(0, 0, 1920, 1088);

        this.collide_with_world();  // Has to be called after the rest of the colliders are defined
    }

}
