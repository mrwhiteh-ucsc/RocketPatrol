class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('trap', './assets/trap.png');
        this.load.image('rat', './assets/rat.png');
        this.load.image('floor', './assets/floor.png');
        this.load.image('UI', './assets/UI.png');
        // load spritesheet
        this.load.spritesheet('floor', './assets/floor.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.floor = this.add.tileSprite(0, 0, 640, 480, 'floor').setOrigin(0, 0);

        
        // add trap (p1)
        this.p1trap = new trap(this, game.config.width/2, 431, 'trap').setScale(0.5, 0.5).setOrigin(0, 0);

        // add rats (x3)
        this.ship01 = new rat(this, game.config.width + 192, 132, 'rat', 0, 30).setOrigin(0,0);
        this.ship02 = new rat(this, game.config.width + 96, 196, 'rat', 0, 20).setOrigin(0,0);
        this.ship03 = new rat(this, game.config.width, 260, 'rat', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.UI = this.add.tileSprite(0, 0, 640, 480, 'UI').setOrigin(0, 0);
        // white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('snap', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll tile sprite
        this.floor.tilePositionX -= 4;
        //sprite updates
        if (!this.gameOver) {     
            //update trap          
            this.p1trap.update();
            //and ships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }             
        // check collisions
        if(this.checkCollision(this.p1trap, this.ship03)) {
            this.p1trap.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1trap, this.ship02)) {
            this.p1trap.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1trap, this.ship01)) {
            this.p1trap.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(trap, ship) {
        // simple AABB checking
        if (trap.x < ship.x + ship.width && 
            trap.x + trap.width > ship.x && 
            trap.y < ship.y + ship.height &&
            trap.height + trap.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        //hide ship
        ship.alpha = 0;
        // create snap sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'snap').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove snap sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;     
        // play sound
        this.sound.play('sfx_snap');  
    }
}