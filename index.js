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
        this.scaleFactor = parameter.scaleFactor || 1;
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
            this.image.width * this.scaleFactor,
            this.image.height * this.scaleFactor
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

        this.friction = 0.99;
        this.speed = 0.1;
        this.hitbox = parameter.hitbox || {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }
    movement() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        console.log(this.velocity.x);

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
            if (event.key === 'd') this.keyPressed.d = true;
            if (event.key === 'a') this.keyPressed.a = true;
        };
        onkeyup = event => {
            this.velocity.x *= this.speed;
            if (event.key === 'd') this.keyPressed.d = false;
            if (event.key === 'a') this.keyPressed.a = false;
        };
    }
    update(context) {
        // context.fillStyle = 'hsl(0 50% 50%/1)';
        // context.fillRect(
        //     this.position.x + this.hitbox.x,
        //     this.position.y + this.hitbox.y,
        //     this.hitbox.width,
        //     this.hitbox.height
        // );
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
            hitbox: {
                width: 40,
                height: 70,
                x: 30,
                y: 17,
            },
            scaleFactor: 2,
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
        this.context.fillStyle = 'hsl(0 0% 0%/0.6)';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.player.update(this.context);
        requestAnimationFrame(this.run);
    };
}

const game = new Game();
game.run();
