let wordsArray = [];
const maxWords = 3;
let mic;
let vol;

function setup(){
    getAudioContext().suspend();
    mic = new p5.AudioIn();
    mic.start();}


document.getElementById("inputField").addEventListener("keypress", function(event) {
/* this = input fieldm, 
   value = current text inside input field 
   trim = method removes any leading and trailing spaces from the input.   */
    if (event.key === "Enter" && this.value !== "") {
        createWord(this.value);
        this.value = "";
    }
});

function createWord (text) {
    const word = document.createElement("div");
    word.classList.add("wordclass");
    word.innerText = text;
    document.body.appendChild(word);

    word.style.left = Math.random() * window.innerWidth + "px";
    word.style.top = "0px";
    word.style.fontSize = '50px';

    wordsArray.push(word);
    
    console.log(wordsArray)

    let speed = Math.random() * 3 + 2;
    let position = 0;
    let fallInterval = setInterval(() => {
     position += speed;
    word.style.top = position + "px"; 
    /*Sets a random fall speed between 2 and 5 pixels per frame.
    Uses setInterval() to move the word down every 30ms.
    Updates the top position to simulate falling. */

    if (position > window.innerHeight) {
        clearInterval(fallInterval);
        word.remove();
        wordsArray = wordsArray.filter(w => w !== word);
        createWord(text);  // Recreate the word to keep the loop going
    }
}, 30);
/*Checks if the word reaches the bottom of the screen.
Stops animation (clearInterval).
Removes the word from the DOM and from the wordsArray.
Calls createWord(text) to restart the word’s fall, keeping the loop active.*/
}

  /* Function: IF volume is 0-0,5 class is .fontthin / if 0.5-0.8 class .fontmid / if 0.8-1 class .fontbold 
  element represents the word (<div class="word">) that was created and animated.*/
 
setInterval(() => {
    vol = mic.getLevel();
    updateWordStyles();
}, 100);

 /* function toggleClass(element) {
    vol = mic.getLevel()
    if (vol < 0.5) { 
        element.classList.toggle("fontthin");
    }
    if (vol > 0.8) { 
        element.classList.toggle("fontbold");
    } else {
        element.classList.toggle("fontmid");
    } 
    console.log (vol)
} */

function updateWordStyles() {
        wordsArray.forEach(word => {
            word.classList.remove("fontthin", "fontmid", "fontbold");
            thickness = map(vol*10, 0, 1, 0.1, 10)
            if (thickness < 3) { 
                word.classList.add("fontthin");
            }else if ( thickness > 8) { 
                word.classList.add("fontmid");
            } else { 
                word.classList.add("fontbold");
            }
        
        });
}

function mousePressed() {
    userStartAudio();
  }
  


function draw(){
    if (wordsArray.length > maxWords - 1) {
        wordsArray.splice(0,1)
    }
}