// global constants
const clueHoldTime = 400; //how long to hold each clue's light/sound
const cluePauseTime = 400; //how long to pause in between clues
const nextClueWaitTime = 400; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [1, 3, 2, 4, 1, 5, 3, 1, 5, 1, 3, 6, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 1.0;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
  
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("endBtn").classList.remove("hidden");
  playClueSequence();
}
function endGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = false;
  // swap the Start and Stop buttons
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("endBtn").classList.add("hidden");
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 300,
  6: 400
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(){
  endGame();
  alert("Game Over. You lost!");
}
function winGame(){
  endGame();
  alert("Game Over. You won!");
}
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  } 
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    loseGame();
  }
  }


