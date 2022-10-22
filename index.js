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
            w: false,
        };
        this.friction = 0.9;
        this.hitbox = parameter.hitbox || {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }
    collision(width, height) {
        this.onGround = false;

        if (this.position.x + this.hitbox.x < 0) this.position.x = -this.hitbox.x;
        if (this.position.x + this.hitbox.x + this.hitbox.width > width)
            this.position.x = width - this.hitbox.x - this.hitbox.width;

        if (this.position.y + this.hitbox.y + this.hitbox.height > height) {
            this.position.y = height - this.hitbox.y - this.hitbox.height;
            this.onGround = true;
        }
    }
    movement() {
        this.position.x += this.velocity.x *= this.friction;
        this.position.y += this.velocity.y *= this.friction;

        if (!this.onGround) this.velocity.y += this.friction;

        if (this.keyPressed.w && this.onGround) this.velocity.y -= this.friction * 20;

        if (this.keyPressed.d) this.velocity.x += this.friction;
        if (this.keyPressed.a) this.velocity.x -= this.friction;

        if (!(this.keyPressed.d || this.keyPressed.a)) this.velocity.x *= this.friction * 0.1;
    }
    stateManager() {
        this.state = 'idle';
        if (this.onGround) {
            if (this.velocity.x > this.friction || this.velocity.x < -this.friction) {
                this.state = 'run';
                console.log('runnin');
            }
        }
        if (!this.onGround) {
            if (this.velocity.y < 0) this.state = 'jump';
            else this.state = 'fall';
        }
    }
    input() {
        onkeydown = event => {
            if (event.key === 'w') this.keyPressed.w = true;
            if (event.key === 'd') this.keyPressed.d = true;
            if (event.key === 'a') this.keyPressed.a = true;
        };
        onkeyup = event => {
            if (event.key === 'w') this.keyPressed.w = false;
            if (event.key === 'd') this.keyPressed.d = false;
            if (event.key === 'a') this.keyPressed.a = false;
        };
    }
    drawHitbox(context) {
        context.fillStyle = 'hsl(0 0% 100%/0.1)';
        context.fillRect(
            this.position.x + this.hitbox.x,
            this.position.y + this.hitbox.y,
            this.hitbox.width,
            this.hitbox.height
        );
    }
    update(context, width, height) {
        this.drawHitbox(context);
        this.stateManager();
        this.input();
        this.movement();
        this.collision(width, height);
        super.update(context);
    }
}
class Game {
    constructor() {
        this.context = document.querySelector('canvas').getContext('2d');

        this.context.canvas.width = 900;
        this.context.canvas.height = 450;

        this.player = new Entity({
            height: this.context.canvas.height,
            scaleFactor: 2,
            hitbox: {
                width: 40,
                height: 70,
                x: 30,
                y: 20,
            },
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
                fall: {
                    imageSrc: 'fall.png',
                    current: 0,
                    counter: 0,
                    max: 3,
                },
                jump: {
                    imageSrc: 'jump.png',
                    current: 0,
                    counter: 0,
                    max: 3,
                },
            },
        });
    }
    run = () => {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.player.update(this.context, this.context.canvas.width, this.context.canvas.height);
        requestAnimationFrame(this.run);
    };
}

const game = new Game();
game.run();
