//roach prefab
class rat extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);

        //store pointValue
        this.points = pointValue;
    }

    update() {
        // move spaceship left
        this.x -= game.settings.roachSpeed;
        // wraparound from left to right edge
        if (this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}