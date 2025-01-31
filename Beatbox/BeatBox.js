let mic;
let vol;
/*let isExpanding = false;
let lastValue = 0; */

function setup(){
    getAudioContext().suspend();
    mic = new p5.AudioIn();
    mic.start();
    createCanvas(800,800);
    
}

/*function draw () {
    background('black');
    let vol = mic.getLevel();
    let h = 600 - (vol * 600);
    const red = Math.floor(255 * vol)
    rectMode (CENTER)
    fill(red, 140, 140);
    square (400,400, h );
    if(lastValue < vol) {
        
    }
    lastValue = vol;
} */

let size = 600;
let targetSize = 600;
let expansionSpeed = 0.1
let shrinkingSpeed = 0.02

function draw(){
    background('black')
    vol = mic.getLevel()
    targetSize = map(vol*20, 0, 1, 600, 300)
    //console.log(vol)
    let maxSize = constrain(targetSize, 100, 600)
    console.log(targetSize)
    if (size < targetSize) {
          size = lerp(size, targetSize, expansionSpeed);
      } else {
       
         size = lerp(size, maxSize, shrinkingSpeed);
      }
     // size = max(size, 100);
      rectMode(CENTER);
      rect(width / 2, height / 2, size, size);
    }

    //size = max(size, 100);



function mousePressed() {
  userStartAudio();
}

