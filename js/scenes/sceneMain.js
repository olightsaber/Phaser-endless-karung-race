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

        // var rndSprite = this.obstacles.getRandomExists();
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

        // let arr = [this.kucing, this.bola, this.batu];
        // arr.map((e) => {
        //   this.moveObstacle(e, Phaser.Math.Between(1, 3))
        // })
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
    }

    createBatu()
    {
      this.batu = this.add.sprite(game.config.width, game.config.height, 'kampoeng', 'batu');
      this.obstacles.add(this.batu);
      this.batu.body.setSize(50, 100, 55, 10); 

      console.log(this.obstacles.GetRandom)
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
      
    }

    // Helpers
    addEvent(delay, callback, name) {
      var event = this.time.addEvent({ delay, callback, callbackScope: this, loop: false });
      event.name = name;
      return event;
    }

    // createObstacles () {
      // this.kucing = this.add.sprite(game.config.width, game.config.height/2, 'kampoeng', 'kucing');
    //   let bola = this.add.sprite(game.config.width, game.config.height/2, 'kampoeng', 'bola');
    //   let batu = this.add.sprite(game.config.width, game.config.height/2, 'kampoeng', 'batu');
      // this.obstacles.add(this.kucing);
    //   this.obstacles.add(bola);
    //   this.obstacles.add(batu);

      // this.obstacles.children.iterate((child) => {
      //   child.body.allowGravity = false;
      //   child.body.immovable = true;
      //   child.body.moves = false;
      //   child.x = game.config.width ;
      //   child.y = game.config.height/2;
      //   child.setScale(.3);
      //   child.setOrigin(.5);
      //   child.active = true; 

      //   this.moveObstacle(child, 1);
      // }) 
      // return this.obstacles.children.entries;
    // }

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







































    // create() {
    //     this.obstacleGroup = this.physics.add.group();

    // Set background
    //     this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'kampoeng', 'background.png').setOrigin(0,0);
    //     this.bg.tilePositionY = 400;

    // set bottom platform;
    //     this.platforms = this.physics.add.staticGroup();
    // this.platforms.create(0, game.config.height, 'sample').setScale(3, .3).refreshBody().setVisible(true);
    //     this.ground = this.add.tileSprite(0, game.config.height, game.config.width, game.config.height, "grass").setOrigin(0, .1).setVisible(true);
    //     this.platforms.add(this.ground);

        // set up Character;
    //     this.char = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'kampoeng', 'char-1.png').setScale(.35).setOrigin(.5,.5);
    //     this.anims.create({
    //         key: 'walk',
    //         frames: this.anims.generateFrameNames('kampoeng', {
    //             start: 0, end: 2, zeroPad: 1, prefix: 'char-', suffix: '.png'
    //         }),
    //         frameRate: 5,
    //         repeat: -1
    //     });
    //     this.char.play('walk');

    //     this.anims.create({
    //         key: "jump",
    //         frames: this.anims.generateFrameNames("kampoeng", { 
    //             start: 1, end: 1, zeroPad: 1, prefix: 'char-', suffix: '.png'
    //         }),
    //         frameRate: 7,
    //         repeat: 1
    //     });
        
    //    set bound to char;
    //     this.char.setCollideWorldBounds(false);

    //     pointer down;
    //     this.input.on('pointerdown', this.charJump, this);
    //     this.char.setBounce(.3);
    //     this.character = this.add.group();
    //     this.character.add(this.char);

    //     platforms collide settings
    //     this.physics.add.collider(this.char, this.platforms);
    //     this.obstacles = this.add.group();

        // let obstacleX = game.config.width;
        // for(let i = 0; i < 10; i++){
            // let obstacle = this.obstacleGroup.create(obstacleX, this.ground.getBounds().top, 'obstacle');
            // obstacle.setOrigin(0.5, 1);
            // obstacle.setImmovable(true);
            // obstacleX += Phaser.Math.Between(mt.model.obstacleDistanceRange[0], mt.model.obstacleDistanceRange[1])
        // }

    //     this.createKucing();

    //     this.time.addEvent({ 
    //         delay: 5000, callback: this.createKucing, callbackScope: this, loop: true 
    //     });
    // }
    // createKucing()
	// {
    //     let kucing = this.physics.add.image(game.config.width + 20, game.config.height/1.2, 'kampoeng', 'kucing.png').setScale(.5);
    //     this.obstacleGroup.add(kucing);
    //     this.physics.add.collider(kucing, this.platforms);
    //     this.physics.add.collider(kucing, this.character);
      // let bola = this.physics.add.image(game.config.width, game.config.height/1.5, 'kampoeng', 'bola.png');
      // let batu = this.physics.add.image(game.config.width, game.config.height/1.5, 'kampoeng', 'batu.png');
      // let arr = [kucing, bola, batu];
      // arr.map((e) => { this.obstacles.add(e) });
    //     kucing.setVelocityX(-50);
	// }
    // char jump
    // charJump()
    // {
    //     this.char.setVelocityY(-200);
    // }
    // update() {
        // set background moving
	// 	this.bg.tilePositionX += mt.model.bgSpeed;
    //     this.ground.tilePositionX += mt.model.bgSpeed;
        
        // if (this.char.x < -100) {
        //     this.scene.restart()
        // }
        // this.obstacles.children.iterate((child)=> {
        //   console.log(child)
        // })
        // var cursors = this.input.keyboard.createCursorKeys();
		// if (cursors.left.isDown)
		// {
		// 	this.char.setVelocityX(-160);
		// 	this.char.anims.play('walk', true);
		// }
		// else if (cursors.right.isDown)
		// {
		// 	this.char.setVelocityX(160);
		// 	this.char.anims.play('walk', true);
		// }
		// else
		// {
		// 	this.char.setVelocityX(0);
		// 	this.char.anims.play('walk', true);
		// }

		// if (cursors.up.isDown && this.char.body.touching.down)
		// {
		// 	this.char.setVelocityY(-350);
		// }
    // }
// }