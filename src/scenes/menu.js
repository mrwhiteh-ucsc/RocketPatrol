class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_rat', './assets/rat.wav');
        this.load.audio('sfx_snap', './assets/snap.wav');
        this.load.audio('sfx_toss', './assets/toss.wav');
        this.load.audio('sfx_roach', './assets/roach.wav');
        this.load.image('title', './assets/title.png');
    }

    create() {
        // menu display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.title = this.add.image(0, 0, 'title', menuConfig).setOrigin(0, 0);

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/3;
        let textSpacer = 64;

        this.add.text(centerX, centerY + 150, 'Use ←→ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + 150 + textSpacer, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);  
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000    
            }
            this.sound.play('sfx_rat');
            this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000    
            }
            this.sound.play('sfx_rat');
            this.scene.start("playScene");    
        }
    }
}