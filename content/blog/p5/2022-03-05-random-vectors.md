---
layout: post
title:  "p5.js: A Perlin Noise Flow Field with Colors and an End"
date: 2022-03-05
tags: [ art, javascript, perlin noise ]
p5: true
---
A colorful vector flow field from the edges.  Got the idea and a lot of the how to from [Roni Kaufman](https://openprocessing.org/sketch/755596). 

<figure id="sketch"></figure>

## The Scripts
```js
let particles = [];
let n = 100;
let pal;
let squiggliness = 1/500;
let lineStroke = 1;

let freq = 4;

function setup(){
  c = createCanvas(1100, 700);
  c.parent("sketch")
  background(0)
  
  noStroke();
  pal = ["#04a3bd", "#f0be3d", "#931e18", "#da7901", "#247d3f", "#20235b"]//Lakota
  updateParticles();
}

function draw(){
  for (let p of particles) {
    p.draw();
    p.move();
    p.stop();
  }
}

function updateParticles(){
  particles = [];
  for(let x = 0; x<width; x+=freq){
    let x_ = x;
    let s_ = lineStroke;
    let cNum = floor(random(pal.length))
    let c_ = color(pal[cNum])
    particles.push(new Particle(x_, 0, s_, c_));
    particles.push(new Particle(x_, height, s_, c_));
  }
  for(let y = 0; y< height; y+=freq){
    let y_ = y;
    let s_ = lineStroke;
    let cNum = floor(random(pal.length))
    let c_ = color(pal[cNum])
    particles.push(new Particle(0, y_, s_, c_));
    particles.push(new Particle(width, y_, s_, c_));
  }
}

class Particle {
  constructor(x_, y_, s_, c_){
    this.x = x_;
    this.y = y_;
    this.size = s_;
    this.c = c_;

    this.alpha = 70; 
    this.dist = 0.75;
  }
  move(){
    let theta = noise(this.x * squiggliness, this.y * squiggliness) * PI * 2;
    let v = p5.Vector.fromAngle(theta, this.dist) 
    this.x += v.x;
    this.y += v.y;
    this.alpha *= 1;

  }
  draw(){
    fill(this.c)
    ellipse(this.x, this.y, this.size)
  }
  stop(){
    if(this.x>width || this.x<0){
      this.dist = 0;
    }
    if(this.y>height || this.height<0){
      this.dist = 0;
    }
  }
}
```

<script>
let particles = [];
let n = 100;
let pal;
let squiggliness = 1/500;
let lineStroke = 1;

let freq = 4;

function setup(){
  c = createCanvas(1100, 700);
  c.parent("sketch")
  background(0)
  
  noStroke();
  pal = ["#04a3bd", "#f0be3d", "#931e18", "#da7901", "#247d3f", "#20235b"]//Lakota
  updateParticles();
}

function draw(){
  for (let p of particles) {
    p.draw();
    p.move();
    p.stop();
  }
}

function updateParticles(){
  particles = [];
  for(let x = 0; x<width; x+=freq){
    let x_ = x;
    let s_ = lineStroke;
    let cNum = floor(random(pal.length))
    let c_ = color(pal[cNum])
    particles.push(new Particle(x_, 0, s_, c_));
    particles.push(new Particle(x_, height, s_, c_));
  }
  for(let y = 0; y< height; y+=freq){
    let y_ = y;
    let s_ = lineStroke;
    let cNum = floor(random(pal.length))
    let c_ = color(pal[cNum])
    particles.push(new Particle(0, y_, s_, c_));
    particles.push(new Particle(width, y_, s_, c_));
  }
}

class Particle {
  constructor(x_, y_, s_, c_){
    this.x = x_;
    this.y = y_;
    this.size = s_;
    this.c = c_;

    this.alpha = 70; 
    this.dist = 0.5;
  }
  move(){
    let theta = noise(this.x * squiggliness, this.y * squiggliness) * PI * 2;
    let v = p5.Vector.fromAngle(theta, this.dist) 
    this.x += v.x;
    this.y += v.y;
    this.alpha *= 1;

  }
  draw(){
    fill(this.c)
    ellipse(this.x, this.y, this.size)
  }
  stop(){
    if(this.x>width || this.x<0){
      this.dist = 0;
    }
    if(this.y>height || this.height<0){
      this.dist = 0;
    }
  }
}

</script>