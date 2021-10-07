class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload(){}

    create(){
        this.cameras.main.roundPixels = true;
        this.physics.world.setBounds(0, 0, game.config.width, game.config.height/2);

        // background
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'kampoeng', 'background.png').setOrigin(0,0).setScrollFactor(0);
        this.bg.tilePositionY = 500;
        this.bg.fixedToCamera = true;
        this.bg.scale = this.bg.height / this.bg.frame.height;

        // init music
        mt.mediaManager.setBackground('bg_song');
        
        // score
        this.score = 0;
        this.scoreText = this.add.text(0,0,
          this.score, {
          fontSize: game.config.width / 10,
          color: "#ffff00"
        });
        this.scoreText.fixedToCamera = true;
        this.scoreText.setScrollFactor(0)

        // NEKO
        this.neko = this.physics.add.sprite(
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            'kampoeng',
            'bola'
        ).setScale(.2);
        
        this.neko.body.allowGravity = false;
        this.neko.body.acceleration.x = 10;
        this.neko.body.velocity.x = 100;

        // set camera to follow player neko as center
        this.cameras.main.startFollow(this.neko);

        // PLAYER
        this.player = this.physics.add.sprite(
          this.neko.x, 
          this.neko.y , 
          'kampoeng', 
          'char-1.png'
        ).setScale(.2);
        this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('kampoeng', {
              start: 0, end: 2, zeroPad: 1, prefix: 'char-', suffix: '.png'
          }),
          frameRate: 5,
          repeat: -1
        });
        this.player.play('walk')
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 450;
        this.player.setImmovable(false); // cus default true
        this.player.state = 'alive';
        this.player.body.setSize(200, this.player.height, 0, 0)

        // this.cameras.main.startFollow(this.player);

        // obstacles
        this.obstacles = this.physics.add.group();

        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // timer
        this.timer = this.time.addEvent();
        this.timer.name = 'Time';
        this.time.start();


        this.obs = new Obstacles();
        // create obstacles

        this.createKucing();
        this.createBola();
        this.createBatu();

        this.obstacles.children.iterate((child) => {
          this.obs.setUp(child);
        })
    } 
    update(){
      var body = this.player.body;
      if (this.player.active == true) {
        this.physics.add.collider(this.player, this.obstacles);
        if (!body.touching.right) {
          this.player.body.velocity.x = this.neko.body.velocity.x;
        }
        if (body.blocked.down || body.touching.down) {
          this.player.anims.msPerFrame = body.velocity.x;
          if (this.jumpButton.isDown || this.input.activePointer.isDown) {
            mt.mediaManager.playSound('jump');
            body.velocity.y = -body.maxVelocity.y;
            //  Every single animation in the Animation Manager will be paused:
            this.player.anims.isPaused ? this.player.anims.resume() : this.player.anims.pause()
          } else {
            this.player.anims.resume();
          }
        } else {
          // this.player.anims.stop();
        }

        // count body x pos compare it with neko
        if (this.player.x < (this.neko.x - game.config.width/2)) {
          mt.mediaManager.playSound('over');
          this.startOver();
          this.player.active = false;
        }

        if (this.score < 10) {
          this.moveObstacle(this.kucing, 1)
        } else if(this.score > 9 && this.score < 19) {
          this.moveObstacle(this.bola, 2)
        } else {
          this.moveObstacle(this.batu, 3)
        }

      } else {
        console.log('You Are Dead!')
      }

      // this.obstacles.forEachAlive(this.updateObstacle, this);
      
      // this.bg.tilePositionX = this.camera.view.x / -2;
      this.bg.tilePositionX = this.cameras.main.scrollX / 2;
      this.updateBounds(); // update bounds world from center neko

      // this.moveObstacle(this.createObstacles() + '[' + Phaser.Math.Between(0, 2) + ']');
    }

    createKucing()
    {
      this.kucing = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'kucing');
      this.obstacles.add(this.kucing);
      this.kucing.body.setSize(100, 100, 50, 50);
    }

    createBola()
    {
        this.bola = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'bola');
        this.obstacles.add(this.bola);
        this.bola.body.setSize(50, 100, 55, 10); 
        this.bola.name = 'bola';
    }

    createBatu()
    {
      this.batu = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'batu');
      this.obstacles.add(this.batu);
      this.batu.body.setSize(50, 100, 55, 10);
    }

    destroySprite (sprite) {
      sprite.destroy();
    }

    updateText()
    {
      this.score++;
      this.scoreText.setText(this.score);
    }

    moveObstacle(obs, speed) {
      obs.x += speed;
      if (obs.x < (this.neko.x - game.config.width/2)) {
        this.updateText();
        this.resetObsPos(obs);
      }
    }

    resetObsPos(obs) {
      obs.x = (this.neko.x + game.config.width/2);
      let randomY = Phaser.Math.Between(this.neko.y + this.neko.y/1.2, this.neko.y + this.neko.y/1.5);
      obs.y = randomY;
      console.log(obs.name == 'bola')
      if (obs.name == 'bola') {
        obs.body.collideWorldBounds = true;
        obs.body.allowGravity = true;
        obs.body.setBounce(.5); 
        obs.body.setGravity(0, 1000);
        obs.body.moves = true;
        obs.body.immovable = true;
        obs.y = this.neko.y;
        this.tweens.add({
          targets: obs,
          duration: 5000,
          angle : -360
        });
      }
    }

    // Helpers
    addEvent(delay, callback, name) {
      var event = this.time.addEvent({ delay, callback, callbackScope: this, loop: false });
      event.name = name;
      return event;
    }

    startOver () {
      this.timer.paused = true;
      this.cameras.main.fadeOut(2000);
      this.addEvent(2000, this.restart, 'restart');
      this.player.state = 'alive';
    }

    restart(){
      this.scene.restart()
    }

    updateBounds() {
      var bounds = this.physics.world.bounds;
      this.physics.world.setBounds(this.neko.x - bounds.centerX, bounds.y, bounds.right, bounds.height);
    }
}