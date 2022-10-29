class Sprite {
    constructor(parameter) {
        this.position = {
            x: 0,
            y: parameter.height || 0,
        };
        this.image = new Image();
        this.animations = parameter.animations;
        this.state = Object.keys(this.animations)[0];
        this.image.src = this.animations[this.state].imageSrc;
        this.image.width /= this.animations[this.state].max;
        this.scaleFactor = parameter.scaleFactor || 1;
        this.frames = {
            counter: 0,
            hold: 5,
        };
    }
    animate() {
        this.image.src = this.animations[this.state].imageSrc;

        this.animations[this.state].current =
            Math.floor(this.frames.counter / this.frames.hold) % this.animations[this.state].max;
        this.frames.counter++;
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
        this.draw(context);
        this.animate();
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
            w: false,
            space: false,
        };
        this.jumpCount = 0;
        this.force = 0.9;
        this.hitbox = parameter.hitbox || {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }
    collision(width, height) {
        if (this.position.x + this.hitbox.x <= 0) this.position.x = -this.hitbox.x;
        if (this.position.x + this.hitbox.x + this.hitbox.width > width)
            this.position.x = width - this.hitbox.x - this.hitbox.width;

        if (this.position.y + this.hitbox.y + this.hitbox.height >= height) {
            this.position.y = height - this.hitbox.y - this.hitbox.height;
            this.onGround = true;
            this.jumpCount = 0;
        } else this.onGround = false;
    }
    horizontalMovement() {
        this.position.x += this.velocity.x *= this.force; // Friction

        if (this.keyPressed.d) this.velocity.x += this.force * 2; // Movespeed
        if (this.keyPressed.a) this.velocity.x -= this.force * 2; // Movespeed

        if (!(this.keyPressed.d || this.keyPressed.a)) this.velocity.x *= this.force * 0.5; // Friction
    }
    verticalMovement() {
        this.position.y += this.velocity.y *= this.force; // Friction

        if (!this.onGround) this.velocity.y += this.force * 2; // Gravity
    }
    jump() {
        this.velocity.y -= this.force * 60;
        this.jumpCount++;
        this.keyPressed.w = true;
    }
    stateManager() {
        if (this.onGround) {
            this.state = 'idle';
            if (this.keyPressed.space) this.state = 'attack';
            if (this.velocity.x > this.force) this.state = 'run';
            if (this.velocity.x < -this.force) this.state = 'runLeft';
        }
        if (!this.onGround) {
            if (this.velocity.y < 0) this.state = 'jump';
            if (this.velocity.y > 0) this.state = 'fall';
        }
    }
    input() {
        onkeydown = (event) => {
            if (event.key === ' ') this.keyPressed.space = true;
            if (event.key === 'd') this.keyPressed.d = true;
            if (event.key === 'a') this.keyPressed.a = true;
            if (event.key === 'w' && !this.keyPressed.w && this.jumpCount < 2) this.jump();
        };
        onkeyup = (event) => {
            if (event.key === 'w') this.keyPressed.w = false;
            if (event.key === 'd') this.keyPressed.d = false;
            if (event.key === 'a') this.keyPressed.a = false;
            if (event.key === ' ') this.keyPressed.space = false;
        };
    }
    drawHitbox(context) {
        context.fillStyle = 'hsl(0 0% 100%)';
        context.fillRect(
            this.position.x + this.hitbox.x,
            this.position.y + this.hitbox.y,
            this.hitbox.width,
            this.hitbox.height
        );
    }
    update(context, width, height) {
        // this.drawHitbox(context);
        super.update(context);
        this.input();
        this.horizontalMovement();
        this.verticalMovement();
        this.stateManager();
        this.collision(width, height);
    }
}
class Game {
    constructor() {
        this.context = document.querySelector('canvas').getContext('2d');

        this.context.canvas.width = this.width = innerWidth * 0.95;
        this.context.canvas.height = this.height = innerHeight * 0.95;

        this.player = new Entity({
            height: this.context.canvas.height,
            scaleFactor: 5,
            hitbox: {
                width: 100,
                height: 220,
                x: 80,
                y: 0,
            },
            animations: {
                idle: {
                    imageSrc: 'idle.png',
                    current: 0,
                    max: 6,
                },
                run: {
                    imageSrc: 'run.png',
                    current: 0,
                    max: 8,
                },
                runLeft: {
                    imageSrc: 'runLeft.png',
                    current: 0,
                    max: 8,
                },
                fall: {
                    imageSrc: 'fall.png',
                    current: 0,
                    max: 3,
                },
                jump: {
                    imageSrc: 'jump.png',
                    current: 0,
                    max: 3,
                },
                attack: {
                    imageSrc: 'attack.png',
                    current: 0,
                    max: 12,
                },
            },
        });
    }
    run = () => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.player.update(this.context, this.width, this.height);
        requestAnimationFrame(this.run);
    };
}

addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.run();
    });


