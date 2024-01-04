//If there are any questions feel free to email me - jberman1@kent.edu
//For adding more projects there will be instructions throughout the code as well as a seperate sheet
//There is also a bubble.js file on this project for the bubble class

var bubbles = [];
let handpose;
let video;
let hands = [];
let pinching = false;
let projectPic = [];
let videoArray = [];
let counter = 0;
let backgroundPic;
let interaction = false;
let lastMouseX;
let lastMouseY;
let noMovementTime = 0; 
let noMovementThreshold = 5;
let mouseTimer = 0;
let videoPlay = false;
let poppedBubbleIndex = -1;
let videoHasPlayed = false;




function preload()
{
  handPic = loadImage('hand fill-17.png');
  handFist = loadImage('hand fill-18.png');
  project1 = loadImage('project1.png');
  project2 = loadImage('project2.png');
  project3 = loadImage('project3.png');
  project4 = loadImage('project4.png');
}

function setup() 
{
  createCanvas(windowWidth, windowHeight); 
  for(var i = 0; i < 4; i++) //Changes the amount of bubbles created
  {
   bubbles[i] = new Bubble(i);
  }
  let currentImage = handPic;
  let vidArray = ['project1Small.mp4', 'project2Small.mp4','project3Small.mp4', 'project4Small.mp4']; //Add video files to this array if adding more projects
  for(let i = 0; i < vidArray.length; i++)
    {
      videoArray[i] = createVideo(vidArray[i]);
      videoArray[i].size(width, height);
      videoArray[i].hide();
    }
    water = createVideo('underwater2.mp4', vidLoad); 
    water.size(width, height);
    vidLoad();
  
  video = createCapture(VIDEO);
  video.size(width, height);
  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => 
  {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
  lastMouseX = mouseX; //Stores the current position for mouseX and mouseY 
  lastMouseY = mouseY;

}

function modelReady() 
{
  console.log("Model ready!");
}

function draw() 
{
  imageMode(CORNER); 
  videoCycle();
  if(interaction && !videoPlay) //If a video isn't playing and there has been interaction within 5 minutes the main code starts
  {
    pinch();
    drawHand();
    drawKeypoints();
    checkMouse();


    for (let i = bubbles.length - 1; i >= 0; i--) 
    {
      let b = bubbles[i];
      if (!b.popped && interaction) 
      {
        b.display();
        b.move();
        b.change();
      }
    else 
      {
        b.popped = false;
        b.y = - 100;
      } 
    }
     popping();
  }
  
  if(!interaction)
  {
    drawKeypoints();
    checkMouse();
  }
 
    lastMouseX = mouseX; //Updates variable to mouseX and mouseY positions
    lastMouseY = mouseY;
  
}


//Checks if mouseX and mouseY / hand is over a bubble and if hand is closed deletes bubble
function popping() 
{
  for (let j = 0; j < bubbles.length; j++)
  {
    if (!bubbles[j].popped)
    {
      let d2 = dist(mouseX, mouseY, bubbles[j].x, bubbles[j].y); //Checks to see if the hand which has the same coordiantes as mouseX and mouseY are over a bubble
      if (d2 < bubbles[j].w / 2 && pinching) //If the hand is over a bubble and its closed then the pop code starts and a video plays
      {
        water.stop();
        poppedBubbleIndex = j; // Store the index of the popped bubble
        bubbles[j].pop();
        videoPlay = true;
        break; // Exit the loop after one bubble is popped
      }
    }
  }
}


// Draws invisible ellipses over keypoints on hand and changes mouseX and mouseY to match coordiantes of the bottom point on middle finger
function drawKeypoints() 
{
  for (let i = 0; i < hands.length; i += 1) //The keypoints track starting from bottom of palm and going from bottom of the finger to the top in order from the thumb to the pinky
  {
    const hand = hands[i]; 
    for (let j = 0; j < hand.landmarks.length; j += 1) 
    {
      const keypoint = hand.landmarks[j];
      //print('Keypoint = ' + hand.landmarks[9][0] + hand.landmarks[9][1] + mouseX + mouseY);
      let invertedX = width - keypoint[0]; //Inverts the x value on the keypoints so hand movement isn't opposite
      fill(0, 255, 0, 0); //Change last number in order to see keypoints in the hand tracking
      noStroke();
      ellipse(invertedX, keypoint[1], 10, 10);
      mouseX = width - hand.landmarks[9][0];
      mouseY = hand.landmarks[9][1];
    } 
  }
}

function pinch()
{
  for (let i = 0; i < hands.length; i += 1) 
  {
    const hand = hands[i]; 
    for (let j = 0; j < hand.landmarks.length; j += 1) 
    {
      const keypoint = hand.landmarks[j];
      let d2 = dist(hand.landmarks[9][0], hand.landmarks[9][1], hand.landmarks[11][0], hand.landmarks[11][1]); //Checks the distance between the bottom of the middle finger and the second highest keypoint in the middle finger to see points go to drawKeypoints and turn the opacity up. Change the 9 and 11 values if you want to change the hand motion for 'pinching' 
      if(d2 <= 20) //Change this value to adjust sensitivity of hand closing the larger the value the more sensitive distance is a big variable in this value
      {
        pinching = true;
      }
      else
      {
        pinching = false;
      }
    }
  }
}

function drawHand() 
{
  imageMode(CENTER); //Draws the hand on the screen and changes it to the closed hand if the pinching variable becomes true
  if(pinching)
  {
    currentImage = handFist;
  }
  else
  {
    currentImage = handPic;
  }
  image(currentImage, mouseX, mouseY, 100, 100);
}


function checkMouse() //If the hand has not moved a timer will start and if the timer reaches 5 minutes it resets to the idle screen which is just the water background
{
  let mouseDist = dist(mouseX, mouseY, lastMouseX, lastMouseY); 
  if (mouseDist > noMovementThreshold) 
  {
    // Mouse has moved
    noMovementTime = 0; // Reset the no movement time
    mouseTimer = 0;
    interaction = true;
  } 
  else 
  {
    noMovementTime += millis(); 
  }
  if (noMovementTime >= noMovementThreshold) 
    {
      if (frameCount % 60 == 0)
      {
        mouseTimer += 1;
      }
      if(mouseTimer >= 300)
      {
        interaction = false;
        mouseTimer = 0;
      }
    }
  
}

function vidLoad() //If a project video is not playing it loops the water background
{
  if (!videoPlay && water.elt.readyState === 4) 
  {
    water.loop();
    water.volume(0);
    water.hide();
  } 
}

function videoCycle() 
{
  
   // Check if a bubble is popped, and play the corresponding video
  if (videoPlay) 
  {
    water.stop();
    videoArray[poppedBubbleIndex].loop();
    videoArray[poppedBubbleIndex].volume(0);
    videoArray[poppedBubbleIndex].hide();
    image(videoArray[poppedBubbleIndex], 0, 0, width, height);

    let vidTime = videoArray[poppedBubbleIndex].time();
    let vidDur =  videoArray[poppedBubbleIndex].duration();
    // When the video ends, perform specific actions
    if(vidTime >= vidDur - 1) //If the video time is close to the duration end the video and go back to the normal interaction screen
      {
        videoArray[poppedBubbleIndex].stop();
        videoPlay = false;
        poppedBubbleIndex = -1;
        videoHasPlayed = true;
      }
    if(videoHasPlayed && !videoPlay)
    {
      water.loop();
    }
  }
  else
    {
      image(water, 0, 0, width, height);
 
    }
}

