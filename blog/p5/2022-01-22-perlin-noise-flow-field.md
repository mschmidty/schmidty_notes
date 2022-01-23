---
layout: post
title:  "p5 Art: Perlin Noise Flow Field "
date: 2022-02-22
tags: [ art, javascript, perlin noise ]
p5: true
---

Played around with 3D perlin noise flow field the other day.  I basically just went through the tutorial on the [Coding Train's YouTube channel](https://www.youtube.com/watch?v=BjoM9oKOAKY) to get started. Looks pretty cool.  This one stops at 60 seconds. 

<figure id="sketch"></figure>

## The Scripts
```js
let v = [];
let particles = [];
let flowField;
let scl = 20;
let cols, rows;
let inc = 0.1;
let zoff = 0;
const partSize = 1.5;
let c;

function setup(){
  c = createCanvas(1100, 700);
  c.parent("sketch")

  cols = floor(width/scl)
  rows = floor(height/scl)
  fr = createP('');

  flowField = new Array(cols * rows);

  for(var i= 0; i<1000; i++){
    particles[i] = new Particle();
  }

  background('#efefef')

}

function draw(){
  let yoff = 0;

  for(let y = 0; y<rows; y++){
    let xoff = 0;
    for(let x = 0; x<cols; x++){
      let index = (x+y*cols);
      let angle = noise(xoff, yoff, zoff) * TWO_PI;
      let cv = map(noise(xoff, yoff, zoff),0,1,0,100); 
      let c = color(`hsl(300, ${cv}%, ${cv}%)`);
      xoff += inc;
      let v = p5.Vector.fromAngle(angle)
      v.setMag(1);
      flowField[index] = v;
    }
    yoff+=inc
    zoff+=0.0005;
  }

  for(let i = 0; i<particles.length; i++){
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

setTimeout(() => {
  noLoop();
}, 100000)

class Particle{

  constructor(_pos, _vel, _acc){
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 2;
    this.prevPos = this.pos.copy();
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0)
  }

  applyForce(force){
    this.acc.add(force);
  }

  show(){
    stroke(0, 5);
    strokeWeight(partSize);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
    this.updatePrev();
  }

  updatePrev(){
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges(){
    if(this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if(this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if(this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if(this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }

  follow(vectors){
    let x = floor(this.pos.x/scl);
    let y = floor(this.pos.y/scl)
    let index = x+y*cols;
    let force = vectors[index];
    this.applyForce(force)
  }
}
```

<script>
let v = [];
let particles = [];
let flowField;
let scl = 20;
let cols, rows;
let inc = 0.1;
let zoff = 0;
const partSize = 1;
let c;

function setup(){
  c = createCanvas(1100, 700);
  c.parent("sketch")
  cols = floor(width/scl)
  rows = floor(height/scl)
  fr = createP('');
  flowField = new Array(cols * rows);
  for(var i= 0; i<1000; i++){
    particles[i] = new Particle();
  }
  background('#efefef')
}

function draw(){
  let yoff = 0;
  for(let y = 0; y<rows; y++){
    let xoff = 0;
    for(let x = 0; x<cols; x++){
      let index = (x+y*cols);
      let angle = noise(xoff, yoff, zoff) * TWO_PI;
      let cv = map(noise(xoff, yoff, zoff),0,1,0,100); 
      let c = color(`hsl(300, ${cv}%, ${cv}%)`);
      xoff += inc;
      let v = p5.Vector.fromAngle(angle)
      v.setMag(1);
      flowField[index] = v;
    }
    yoff+=inc
    zoff+=0.0005;
  }
  for(let i = 0; i<particles.length; i++){
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

setTimeout(() => {
  noLoop();
}, 100000)

class Particle{
  constructor(_pos, _vel, _acc){
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxSpeed = 2;
    this.prevPos = this.pos.copy();
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0)
  }
  applyForce(force){
    this.acc.add(force);
  }
  show(){
    stroke(0, 5);
    strokeWeight(partSize);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
    //point()
    this.updatePrev();
  }
  updatePrev(){
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  edges(){
    if(this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if(this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if(this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if(this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }

  follow(vectors){
    let x = floor(this.pos.x/scl);
    let y = floor(this.pos.y/scl)
    let index = x+y*cols;
    let force = vectors[index];
    this.applyForce(force)
  }
}
</script>