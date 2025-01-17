import { BaseScene } from "./base.js";

import Software from "../assets/maps/software_v.json";
import TilesetImage from "../assets/tilesets/tileset_extruded.png";
import Player from "../assets/atlas/player.json";
import PlayerImg from "../assets/atlas/player.png";

export default class SoftwareScene extends BaseScene {

  constructor() {
    super('SoftwareScene');
  }

  preload() {
    //this.load.tilemapTiledJSON("SoftwareMap", Software);
    this.load.image("TilesetImage", TilesetImage);
    this.load.tilemapTiledJSON("SoftwareMap", Software);
    this.load.atlas("atlas", PlayerImg, Player);
  }

  create() {
    super.create("SoftwareMap");

    // Resize the world and camera bounds
    this.physics.world.setBounds(0, 0, 960, 768);
    this.cameras.main.setBounds(0, 0, 960, 768);

    // On scene switch (after entering through the door) display the walking UP texture
    this.events.on('create', () => { this.player.setTexture("atlas", "ariel-back") }, this);
    this.events.on('wake', () => { this.player.setTexture("atlas", "ariel-back") }, this);

    this.collide_with_world();  // Has to be called after the rest of the colliders are defined
  }

}
