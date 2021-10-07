class SceneInstructions extends Phaser.Scene {
    constructor() {
        super('SceneInstructions');
    }
    preload() {}
    create() {
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
       this.aGrid.showNumbers();

        this.player = this.physics.add.sprite(0, 0, 'kampoeng', 'char-1.png').setScale(.5);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('kampoeng', {
                start: 0, end: 1, zeroPad: 1, prefix: 'char-', suffix: '.png'
            }),
            frameRate: 2,
            repeat: -1
        });
        this.player.play('walk');
        this.aGrid.placeAtIndex(122, this.player);

        this.text1 = this.add.text(0, 0, mt.model.instructionText, {
            color: "#000000",
            fontSize: game.config.width / 25,
            backgroundColor:"#ffffff"
        });
        this.text1.setOrigin(0.5, 0.5);
        this.aGrid.placeAtIndex(115, this.text1);

        this.btnStart = new TextButton({
            scene: this,
            key: "green",
            event: mt.constants.SHOW_TITLE,
            params:this.scene,
            text: "Back",
            scale: .35,
            textScale: 25,
            textColor: '#fff'
        });
        this.aGrid.placeAtIndex(139,this.btnStart);

    }
    update() {}
}