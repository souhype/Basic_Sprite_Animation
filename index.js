class Sprite {
    constructor(parameter) {
        this.position = {
            x: 0,
            y: 0,
        };
        this.image = new Image();
        this.animations = parameter.animations;
        this.state = Object.keys(this.animations)[0];
        this.image.src = this.animations[this.state].imageSrc;
        this.image.width /= this.animations[this.state].max;
    }
    animate() {
        this.image.src = this.animations[this.state].imageSrc;

        this.animations[this.state].current =
            Math.floor(this.animations[this.state].counter / this.animations[this.state].max) %
            this.animations[this.state].max;
        this.animations[this.state].counter++;
    }
    draw(context) {
        context.drawImage(
            this.image,
            this.animations[this.state].current * this.image.width,
            0,
            this.image.width,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width,
            this.image.height
        );
    }
    update(context) {
        this.animate();
        this.draw(context);
    }
}
class Entity extends Sprite {
    constructor(parameter) {
        super(parameter);
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.keyPressed = {
            d: false,
            a: false,
        };

        this.friction = 0.95;
        this.speed = 0.1;
    }
    movement() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        if (this.keyPressed.d) this.velocity.x += this.speed;
        if (this.keyPressed.a) this.velocity.x -= this.speed;
    }
    stateManager() {
        if (this.velocity.x > this.friction || this.velocity.x < -this.friction) this.state = 'run';
        else this.state = 'idle';
    }

    input() {
        onkeydown = event => {
            if (event.key === 'd') {
                this.keyPressed.d = true;
            }
            if (event.key === 'a') {
                this.keyPressed.a = true;
            }
        };
        onkeyup = event => {
            this.velocity.x *= this.speed;
            if (event.key === 'd') this.keyPressed.d = false;
            if (event.key === 'a') this.keyPressed.a = false;
        };
    }
    update(context) {
        super.update(context);
        this.stateManager();
        this.input();
        this.movement();
    }
}
class Game {
    constructor() {
        this.context = document.querySelector('canvas').getContext('2d');

        this.context.canvas.width = 900;
        this.context.canvas.height = 450;

        this.player = new Entity({
            animations: {
                idle: {
                    imageSrc: 'idle.png',
                    current: 0,
                    counter: 0,
                    max: 6,
                },
                run: {
                    imageSrc: 'run.png',
                    current: 0,
                    counter: 0,
                    max: 8,
                },
            },
        });
    }

    run = () => {
        this.context.clearRect(0, 0, 900, 450);
        this.player.update(this.context);
        requestAnimationFrame(this.run);
    };
}

const game = new Game();
game.run();
