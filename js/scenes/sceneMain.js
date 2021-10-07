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
        
        this.bg.scale = this.bg.frame.height / this.bg.frame.height;
        
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
        this.neko.visible = false;

        // set camera to follow player neko as center
        this.cameras.main.startFollow(this.neko);

        // PLAYER
        this.player = this.physics.add.sprite(
          this.neko.x, 
          this.neko.y , 
          'kampoeng', 
          'char-1.png'
        ).setScale(.35);
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
        this.player.body.setSize(200, this.player.height, 0, 0);

        // obstacles
        this.obstacles = this.physics.add.group();

        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // timer
        this.timer = this.time.addEvent();
        this.timer.name = 'Time';
        this.time.start();

        // create obstacles
        this.obs = new Obstacles();
        this.createKucing();
        this.createBola();
        this.createBatu();
          
    } 
    update(){
      var body = this.player.body;
      if (this.player.active == true) {
        this.physics.add.collider(this.player, this.obstacles);
        if (!body.touching.right) {
          this.player.body.velocity.x = this.neko.body.velocity.x;
        }
        if (body.blocked.down || body.touching.down) {
          let pace = Math.floor(body.velocity.x);
          if (pace < 300) {
            pace = 110;
          } else if( pace > 300 && pace < 550) {
            pace = 95;
          } else if( pace > 550 && pace < 700) {
            pace = 80
          } else if( pace > 700 && pace < 850) {
            pace = 65
          } else if( pace > 850 && pace < 1000) {
            pace = 45;
          } else {
            pace = 25;
          }
          this.player.anims.msPerFrame = pace;
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
          this.player.active = false;
        }

        
        if (this.score < 10) {
          this.moveObstacle(this.kucing, 1)
        } else if(this.score > 9 && this.score < 19) {
          this.moveObstacle(this.bola, 2)
        } else {
          this.moveObstacle(this.batu, 3  )
        }

        this.bg.tilePositionX = this.cameras.main.scrollX / 2;
        this.updateBounds(); // update bounds world from center neko
      } else {
        // console.log('You Are Dead!')
        this.doGameOver();
      }
    }

    doGameOver() {
      this.scene.start("SceneOver");
    }

    createKucing()
    {
      this.kucing = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'kucing');
      this.obstacles.add(this.kucing);
      this.kucing.body.setSize(100, 100, 50, 50);
      this.kucing.name = 'kucing';
      this.obs.setUp(this.kucing)
    }

    createBola()
    {
      this.bola = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'bola');
      this.obstacles.add(this.bola);
      this.bola.body.setSize(50, 100, 55, 10);
      this.bola.setScale(.4);
      this.bola.name = 'bola';
    }

    createBatu()
    {
      this.batu = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'batu');
      this.obstacles.add(this. batu);
      this.batu.setScale(.3);
      this.batu.body.setSize(50, 100, 55, 10);
      this.batu.name = 'batu';
      this.batu.body.immovable = true;
      this.batu.body.moves = false;
    }

    updateText()
    {
      this.score++;
      mt.model.scoreResult = this.score;
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
      if (obs.name == 'bola') {
        obs.body.collideWorldBounds = true;
        obs.body.allowGravity = true;
        obs.body.setBounce(.5); 
        obs.body.setGravity(0, 1000);
        obs.body.moves = true;
        obs.body.immovable = true;
        obs.y = Phaser.Math.Between(this.neko.y, this.neko.y+this.player.height);
        this.tweens.add({
          targets: obs,
          duration: 5000,
          angle : -720
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
      // this.timer.paused = true;
      this.cameras.main.fadeOut(3000);
      this.addEvent(2000, this.restart, 'restart');
      this.player.state = 'alive';
      // this.scene.start("SceneOver");
    }

    restart(){
      this.scene.restart()
    }

    updateBounds() {
      var bounds = this.physics.world.bounds;
      this.physics.world.setBounds(this.neko.x - bounds.centerX, bounds.y, bounds.right, bounds.height);
    }
}