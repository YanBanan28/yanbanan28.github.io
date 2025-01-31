let mic;
let vol;

const colors = ["rgba(255, 140, 140, 0.7)", "rgba(119, 255, 119, 0.7)", "rgba(97, 97, 255, 0.7)", "rgba(255, 255, 52, 0.7)", "rgba(255, 95, 255, 0.7)", "rgba(109, 255, 255, 0.7)"];
const blendModes = ["overlay", "screen", "hard-light"];

let triangles = [];





function setup() {
    getAudioContext().suspend()
    mic = new p5.AudioIn();
    mic.start();
    createCanvas(window.innerWidth, window.innerHeight);
    
    for (let i = 0; i < 20; i++) {
        triangles.push(new MovingTriangle());
}}

function draw() {
    background(0); 
    vol = mic.getLevel();
    speedFactor = map(vol, 0, 1, 0.1, 10) ;
    for (let tri of triangles) {
        tri.update();  
        tri.display();
    }
}
class MovingTriangle {
    constructor() {
        this.vx = random(-3, 3);
        this.vy = random(-3, 3);
        this.size1 = random(500, 1000);
        this.size2 = random(500, 1000);
        this.blendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360; // Initial rotation angle
        this.rotationSpeed = (Math.random() - 0.5) * 2; // Rotation speed
        this.x = random(window.innerWidth - (this.size1 / 2));
        this.y = random(window.innerHeight - (this.size1 /2));
    }
    
    update() {
        this.x += this.vx * speedFactor;
        this.y += this.vy * speedFactor;
        translate(this.x, this.y)
        this.rotation += this.rotationSpeed * speedFactor;
        resetMatrix();
       /* if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1; */
        if (this.x - this.size1 / 2 < 0 || this.x + this.size1 / 2 > width) {
            this.vx *= -1;
        }
        if (this.y - this.size2 / 2 < 0 || this.y > height) {
            this.vy *= -1;
        }
    }
    
    display() {
        push();
        translate(this.x, this.y)
        rotate((this.rotation * Math.PI)/180);
        blendMode(this.blendMode);
        fill(this.color);
        noStroke();
        triangle(0, 0, 0 + this.size1, 0, 0 + this.size1 / 2, 0 - this.size2);
        resetMatrix();
        pop();
    }
}

function mousePressed() {
    userStartAudio();
  }

