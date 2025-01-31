/*const canvas = document.querySelector('.window')
canvas.width = 700;
canvas.height = 700; */
let mic;
let vol;
let triangles = [];
const colors = ["rgba(255, 0, 0, 0.7)", "rgba(0, 255, 0, 0.7)", "rgba(0, 0, 255, 0.7)", "rgba(255, 255, 0, 0.7)", "rgba(255, 0, 255, 0.7)", "rgba(0, 255, 255, 0.7)"];
const blendModes = ["overlay", "screen", "hard-light"];
let speedFactor = 0.5;
let canvas;
function setup(){
    mic = new p5.AudioIn();
    mic.start();
    canvas = createCanvas(800,800);
    for (let i = 0; i < 10; i++) {
        triangles.push(createTriangle());
    } 
}

function createTriangle() {
    const base = Math.random() * 750 + 500; // 5 times larger base size
    const height = Math.random() * 750 + 500; // 5 times larger height size
    return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    base,
    height,
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4,
    rotation: Math.random() * 360, // Initial rotation angle
    rotationSpeed: (Math.random() - 0.5) * 2, // Rotation speed
    color: colors[Math.floor(Math.random() * colors.length)],
    blendMode: blendModes[Math.floor(Math.random() * blendModes.length)] // Random blend mode
    } 
}
function drawTriangle(triangle) {
    push();
        translate(triangle.x, triangle.y);
        fill(triangle.color)
        rotate((triangle.rotation * Math.PI) / 180);
        triangle(0,0,triangle.base,0,triangle.base / 2, triangle.height)
    pop();
    resetMatrix();
}
function updateTriangles() {
    //clearRect(0, 0, canvas.width, canvas.height);
    triangles.forEach(triangle => {
        triangle.x += triangle.dx * speedFactor;
        triangle.y += triangle.dy * speedFactor;
        triangle.rotation += triangle.rotationSpeed * speedFactor;

        if (triangle.x < 0 || triangle.x > canvas.width) {
            triangle.dx *= -1;
        }

        if (triangle.y < 0 || triangle.y > canvas.height) {
            triangle.dy *= -1;
        }

        drawTriangle(triangle);
    });
}
//called every 1ms
function draw(){
    triangles.forEach((triangle) => {
        push();
        translate(triangle.x, triangle.y);
        fill(triangle.color)
        rotate((triangle.rotation * Math.PI) / 180);
        triangle(0,0,triangle.base,0,triangle.base / 2, triangle.height)
    pop();
    resetMatrix();
    })
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Increase speed on mouse down, reset on mouse up
window.addEventListener("mousedown", () => {
    speedFactor = 1.0; // Normal speed
});

window.addEventListener("mouseup", () => {
    speedFactor = 0.5; // Slow speed
});
