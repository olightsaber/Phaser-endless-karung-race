class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    }
    preload() {
        
    }
    create() {
        // init music
        mt.mediaManager.setBackground('bg_song');
        
        // background
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'kampoeng', 'background.png').setOrigin(0,0);
        this.bg.tilePositionX = 120;
        this.bg.tilePositionY = 450;

        this.bottom = this.add.sprite(0, game.config.height - 20, "grass");
        this.bottom.setOrigin(0, 0);
        this.bottom.displayWidth = game.config.width;
        
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 14,
            cols: 12
        });
        // this.aGrid.showNumbers();       
       
        //////////////////////////////
        // TITLE TEXT ////////////////
        this.titleText = this.add.text(0, 0, mt.model.gameTitle, {
            fontSize: game.config.width / 10,
            fill: "#fff"
        });
        this.aGrid.placeAtIndex(5, this.titleText)

        // ////////////////////////
        // PLAYER 
        this.player = this.physics.add.sprite(0, 0, 'kampoeng', 'char-1.png').setScale(.5);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('kampoeng', {
                start: 0, end: 2, zeroPad: 1, prefix: 'char-', suffix: '.png'
            }),
            frameRate: 5,
            repeat: -1
        });
        this.player.play('walk');
        this.aGrid.placeAtIndex(122, this.player);

        this.btnStart = new TextButton({
            scene: this,
            key: "green",
            event: mt.constants.START_GAME,
            params: this.scene,
            text: "Start!",
            scale: .3,
            textScale: 30,
            textColor: '#FFF'
        });
        this.aGrid.placeAtIndex(91, this.btnStart)
        //
        //
        this.btnInstr = new TextButton({
            scene: this,
            key: "orange",
            event: mt.constants.SHOW_INSTR,
            params: this.scene,
            text: "How to Play?",
            scale: .3,
            textScale: 30,
            textColor: '#FFF'
        });
        this.aGrid.placeAtIndex(115, this.btnInstr);

        this.btnSettings = new TextButton({
            scene: this,
            key: "blue",
            event: mt.constants.SHOW_SETTINGS,
            params: this.scene,
            text: "Settings",
            scale: .3,
            textScale: 30,
            textColor: '#FFF'
        });
        this.aGrid.placeAtIndex(139, this.btnSettings);


    }
}