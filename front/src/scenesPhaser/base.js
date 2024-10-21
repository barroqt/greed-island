import Phaser from 'phaser'
import { shortString } from '../utils';

export class BaseScene extends Phaser.Scene {

  debug = false;
  movable = true;
  timeOutSendCoord = null;

  emitKeyboard(key) {
    this.events.emit('keyboard', key);
  }

  getPlayerPosition() {
    this.events.emit('player', this.player);
  }

  emitMap(newMap) {
    this.events.emit('map', newMap);
  }

  // --------------------------------------------------------------------------------------------------
  // CREATE
  create(tilemapKey) {
    // ----------------
    // MAP AND TILESET
    this.map = this.make.tilemap({ key: tilemapKey });

    //const tileset = this.map.addTilesetImage("tileset", "TilesetImage");
    // With added margin and spacing for the extruded image:
    const tileset = this.map.addTilesetImage("tileset", "TilesetImage", 32, 32, 1, 2);

    // Map layers (defined in Tiled)
    this.map.createLayer("Ground1", tileset, 0, 0);
    this.map.createLayer("Ground2", tileset, 0, 0);
    this.map.createLayer("Collision1", tileset, 0, 0);
    this.map.createLayer("Collision2", tileset, 0, 0);
    this.map.createLayer("Above", tileset, 0, 0).setDepth(10);  // To have the "Above" layer sit on top of the player, we give it a depth.
    // The layer with wich the player will collide
    this.LayerToCollide = this.map.createLayer("CollisionLayer", tileset, 0, 0);
    this.LayerToCollide.setVisible(false);  // Comment out this line if you wish to see which objects the player will collide with

    // ----------------
    // PLAYER
    // Get the spawn point
    const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");

    // Create the player and the player animations (see player.js)
    this.player = this.add.player(spawnPoint.x, spawnPoint.y, "atlas", "ariel-front");

    // multiplayer = { [key: playerName]: { players, map } }
    this.multiplayer = {};
    this.multiplayerNames = {};
    this.clickOnPlayer = false;

    // ----------------
    // CAMERA AND CURSORS
    const camera = this.cameras.main;
    if (this.player) {
      camera.startFollow(this.player);
      camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = { // TODO FR OR EN ?
      w: this.input.keyboard.addKey('W'),
      a: this.input.keyboard.addKey('A'),
      //w: this.input.keyboard.addKey('Z'),
      //a: this.input.keyboard.addKey('Q'),
      s: this.input.keyboard.addKey('S'),
      d: this.input.keyboard.addKey('D'),
    }

    // Camera resize behavior
    this.scale.on('resize', this.resize, this);

    // ----------------
    // INTERACTIVE OBJECTS
    this.signs = [];
    this.showingSign = false;
    this.map.filterObjects("Objects", obj => {
      // DOORS
      if (obj.name === 'door') {
        this.add.door(
          Math.round(obj.x),
          Math.round(obj.y),
          obj.width,
          obj.height,
          obj.properties[0].value,
          () => this.emitMap(obj.properties[0].value),
        );
        // last 2: destination (str) and link (bool, if true leads to a redirect)
      }

      // SIGNS
      if (obj.name === 'sign') {
        this.signs.push(this.add.sign(obj.x, obj.y, obj.properties[1].value, obj.properties[0].value))
        // Last parameters are the text to show and the direction of the text in relation to the object
      }

    });

    this.input.keyboard.on('keydown', (event) => { this.emitKeyboard(event); })
    this.events.on('break', this.catchDoBreak, this);
    this.events.on('position', this.getPlayerPosition, this);
    this.events.on('moveanotherplayer', (arg) => this.handleMultiplayer(arg), this);
    // arg: { previousMap: string, newMap: string }
    this.events.on('movetomap', (arg) => {
      this.scene.switch(arg.newMap);
    }, this);
    // arg: name player
    this.events.on('playerName', (arg) => this.player && this.player.setName(arg), this);
    // arg: name player
    this.events.on('destroyplayer', (arg) => this.destroyPlayer(arg));
  }

  createPlayer(data) {
    this.multiplayer[data.name] = { player: null, map: '' };
    this.multiplayer[data.name].player = this.add.player(data.pos.x, data.pos.y, "atlas", "ariel-front");
    this.multiplayer[data.name].player.setName(data.name);
    this.multiplayer[data.name].map = data.pos.map;
    this.multiplayerNames[data.name] = { text: '', map: '' };
    this.multiplayerNames[data.name].text = this.add.text(data.pos.x - 40, data.pos.y - 40, shortString(data.name));
    this.multiplayerNames[data.name].map = data.pos.map;
  }

  destroyPlayer(name) {
    if (debug) console.log({ destroyplayer: name });
    this.multiplayer[name].player.destroy();
    delete this.multiplayer[name];
    this.multiplayerNames[name].text.destroy();
    delete this.multiplayerNames[name];
  }

  handleMultiplayer(data) {
    if (debug) console.log('handleMultiplayer');
    if (data.name && data.pos) {
      if (this.multiplayer[data.name]) {
        if (debug) console.log('i know u');
        this.multiplayer[data.name].player.changePosition(data.pos.x, data.pos.y);
        this.multiplayer[data.name].map = data.pos.map;
        this.multiplayerNames[data.name].text.setPosition(data.pos.x - 40, data.pos.y - 40);
        this.multiplayerNames[data.name].map = data.pos.map;
        //setTimeout(() => this.multiplayer[data.name].update(false, false, false, false), 500);
      } else {
        if (debug) console.log('add', data.name);
        this.createPlayer(data);
      }
    }
    if (debug) console.log(this.multiplayer);
  }

  catchDoBreak() {
    console.log('do break', !this.movable);
    this.movable = !this.movable;
  }

  // ---------------------------------------------------
  resize(gameSize, baseSize, displaySize, resolution) {
    this.cameras.resize(gameSize.width, gameSize.height);
  }

  collide_with_world() {
    // Collision with the world layers. Has to come after the rest of the colliders in order for them to detect.
    // We need to call this at the end of the children's create
    this.physics.add.collider(this.player, this.LayerToCollide);
    this.LayerToCollide.setCollisionBetween(40, 41);

    // Set the player to collide with the world bounds
    if (this.player && this.player.body) {
      this.player.body.setCollideWorldBounds(true);
      this.player.body.onWorldBounds = true;
    }
  }

  // --------------------------------------------------------------------------------------------------
  // UPDATE
  update(time, delta) {
    let moveleft = false;
    let moveright = false;
    let moveup = false;
    let movedown = false;

    // display names
    for (let i = 0; i < this.multiplayerNames.length; i++) {
      const name = Object.keys(this.multiplayerNames)[i];
      const user = this.multiplayer[name];
      this.multiplayerNames[name].text.setPosition(user.x - 40, user.y - 40);
    }

    // Not movable? stop movement and return
    if (!this.movable && this.player) {
      this.player.update(moveleft, moveright, moveup, movedown);
      return false;
    }

    // ----------------
    // MOUSE MOVEMENT
    // check if click on anotherplayer
    let isMultiplayerClick = false;
    let pointer = this.input.activePointer;

    // launch interaction between players
    /*if (!this.clickOnPlayer && !pointer.primaryDown && !window.mouseOverMenu) {
      let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      for (let i = 0; i < Object.keys(this.multiplayer).length; i++) {
        const user = this.multiplayer[Object.keys(this.multiplayer)[i]];
        if ((user.x - 20 < pointerPosition.x && user.x + 20 > pointerPosition.x)
          && (user.y - 20 < pointerPosition.y && user.y + 20 > pointerPosition.y)) {
          this.events.emit('clickOnPlayer', user);
          isMultiplayerClick = true;
          this.clickOnPlayer = true;
        }
      }
    } else if (this.clickOnPlayer && pointer.primaryDown) {
      this.clickOnPlayer = false;
    }*/

    if (this.player && !isMultiplayerClick && pointer.primaryDown && !window.mouseOverMenu) {
      // let pointerPosition = pointer.position;
      // So that the x and y update if the camera moves and the mouse does not
      let pointerPosition = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      // Horizontal movement
      if (Math.abs(pointerPosition.x - this.player.x) > 15) {  // To avoid glitching when the player hits the cursor
        if (pointerPosition.x > this.player.x) {
          moveright = true;
        } else if (pointerPosition.x < this.player.x) {
          moveleft = true;
        }
      }

      // Vertical movement
      if (Math.abs(pointerPosition.y - this.player.y) > 15) {  // To avoid glitching when the player hits the cursor
        if (pointerPosition.y > this.player.y) {
          movedown = true;
        } else if (pointerPosition.y < this.player.y) {
          moveup = true;
        }
      }
    }

    // ----------------
    // KEYBOARD MOVEMENT
    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.a.isDown) {
      moveleft = true;
    } else if (this.cursors.right.isDown || this.wasd.d.isDown) {
      moveright = true;
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.w.isDown) {
      moveup = true;
    } else if (this.cursors.down.isDown || this.wasd.s.isDown) {
      movedown = true;
    }

    // Update player velocity and animation
    if (!isMultiplayerClick && this.player)
      this.player.update(moveleft, moveright, moveup, movedown);

    // emit move
    if (!isMultiplayerClick && this.player && (moveleft || moveright || moveup || movedown)) {
      if (this.timeOutSendCoord) clearTimeout(this.timeOutSendCoord);
      this.timeOutSendCoord = setTimeout(() => {
        this.getPlayerPosition();
      }, 100);
    }

    // ---------------------
    // INTERACTIVE OBJECTS
    // Hide the signs
    if (this.player && this.showingSign && (moveleft || moveright || moveup || movedown)) {
      this.signs.forEach((sign) => {
        if (sign.activated) sign.playerMovement(moveleft, moveright, moveup, movedown)
      });
    }

  }

}