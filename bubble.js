let currentImageIndex = 0;
let intersecting = false;
let d3;

class Bubble 
{
  constructor(index) 
  {
    this.index = index;
    this.x = random(0, windowWidth);
    this.y = height + 100;
    this.w = 200;
    this.xSpeed = random(1, 2.5);
    this.ySpeed = random(-2, -1);
    this.xDirection = random(-1, 1);
    this.popped = false;
  }
  
  display() 
  {
    projectPic = [project1, project2, project3, project4]; //For adding new projects add the extra image variable to this array and add more bubbles to the setup function in sketch.js then new bubbles will appear
    imageMode(CENTER);
    image(projectPic[this.index], this.x, this.y, this.w, 300);
    currentImageIndex = (currentImageIndex + 1) % projectPic.length;
  }

  move() //Gives bubbles different speeds and resets the bubbles to the bottom once they go off the screen on top
  { 
    this.y = this.y + this.ySpeed;
    this.x = this.x + this.xSpeed * this.xDirection;
    if(this.y < -100) 
    {
      this.y = height + 100;
      this.x = random(0, width);
      this.popped = false;
    }
  }
  //Changes direction on wall hit
  change() 
  {
     if (this.x < 0 || this.x > width) 
     {
        this.xDirection *= -1;
     }
  }
 pop() //Resets a bubble on pop and adjusts the index for the video to the bubble index so the video matches with the corresponding bubble
  {
    this.popped = true;
    this.x = random(0, windowWidth);
    this.y = height + 100;
    currentImageIndex = this.index;
  }
}

  