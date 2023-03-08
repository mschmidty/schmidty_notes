---
layout: post
title:  "A New Schmidtynotes"
date: 2022-08-17
tags: [js, 11ty, Design]
---

About a year ago I redesigned this site.  I mostly liked my old site, but I wanted to move away from [Jekyll](https://jekyllrb.com).  I didn't dislike Jekyll, but programming brings many technologies to learn.  I've been heading down the javascript path for a while now learning express.js and p5.  I wanted to complete my transformation with the move to [Eleventy (or 11ty)](https://www.11ty.dev/). This post covers problems I had moving from Jekyll to Eleventy, how I solved them, and introduces some features of the new site.  

Just a note, this isn't a tutorial.  If you are looking for a post on how to switch from Jekyll to Eleventy, I suggest the [24 Ways post by Paul Lloyd](https://24ways.org/2018/turn-jekyll-up-to-eleventy/). 
<!-- excerpt -->


## From Jekyll to Eleventy

So why Eleventy?  Honestly, I wish it was some well thought out decision but it wasn't.  I saw a tutorial on the [Learn with Jason Youtube Channel with Zach Leatherman (Eleventy Inventor)](https://www.youtube.com/watch?v=j8mJrhhdHWc) a few years ago inspiring me to build a [Bird ID Practice app](https://github.com/mschmidty/bird_id_trainer) for my crews using Eleventy (I've now ported it over to a Vue app...because that seemed to be more appropriate for the task).  I didn't harness the full potential of Eleventy while building the app, I used it as a template generator for this first project and then used javascript template literals to loop over a csv of data.  That experience with Eleventy, and the fact that Eleventy uses javascript, swayed me to dive in. I've played with python, javascript, and ruby over the years, never getting very good at any of them. About a year ago I decided that I was going to stick with javascript.  I learned Express.js and Vue, completed some of the Advent of Code in javascript, and played around with p5js. Now I needed a static site generator in javascript. 

### The Switch
So I started building a theme with dummy content.  It was a breeze.  I got to do what I'm good at, html, css and some basic JS.  Then I replaced my dummy content with real content and blam, errors for days. Turns out the front matter of Jekyll posts is not the same as Eleventy posts. As with any coding side project I enjoy learning new things when doing them.  I figured it was high time I practice doing things in javascript and also use the opportunity to learn Regex.  As with most things coding [The Coding Train](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YEypLuls7iidwHMdCM6o2w) is always a gentel introduction.  The script below reads each post in a `data` folder and takes (almost..) every Jekyll syntax that Eleventy doesn't like and converts it to a format Eleventy does like.  The things I needed to change were date formats and tags in the headers, the markdown image syntax. In hindsight, I could have handled all of this stuff with filters in Eleventy and that would have helped me learn Eleventy. Oh well.

```js
const fs = require('fs');

const folder = './data/';
const outputFolder = './output/';

fs.readdirSync(folder).forEach(file=>{
  readFixOutput(file, outputFolder)
})

function readFixOutput(fileName, output){
  fs.readFile(folder + fileName, 'utf8', (err,data)=>{
    if(err){
      console.error(err)
      return
    }

    const fixedHtml = changeHtmlToMd(data)
    const fixedImages = fixImages(fixedHtml)
    const fixedFrontMatter = fixFrontMatter(fixedImages)
    const fixedCodeBlocks =  replaceCodeSnippetStart(fixedFrontMatter);
    const finalMD = removeRelativeUrl(fixedCodeBlocks);

    fs.writeFile(output + fileName, finalMD, err=> {
      if(err) {
        console.error(err)
        return
      }
    })
  })
}

// This function finds a line by a keyword and returns that whole line. It then extracts all of the 
// information inbetween  [] and then adds each element into an array.  
//The result is an array with each of the categories as an item in the array. 


function fixFrontMatter(text){
  var fixingText = text.replace(/date:.*(20[0-9]{2}-[0-9]{1,2}-[0-9]{1,2}).*/, "date: " + "$1")
    .replace(/categories:/, 'tags:')
  return fixingText;
}

function fixImages(text){
  const r = /(!\[.*\]).*\{.*["'](.*)["'].*/g;
  return text.replace(r, function(match, group1, group2){
    if(/^\//.test(group2)){
      return group1+"(/img"+group2+")"
    }else{
      return group1+"(/img/"+group2+")"
    }
  })
}

function changeHtmlToMd(text){
  return text.replace(/.*nomarkdown.*\n/gm, "")
    .replace(/<img.*\{["'](.*?)["'].*/, "![image](/img"+"$1"+")")
}

//There was a removeRelativeUrl function here but the regex was making eleventy throw an error. 

function replaceCodeSnippetStart(text){
  return text.replace(/\{r\}/g, "r")
}
```

While this script didn't solve all of the problems I had, it automated a lot of the transition and I got to learn about Regex.

## SCSS 
In the past I've leaned heavily on [Gulp.js](https://gulpjs.com/) as a build tool.  I've typically used it to handle `scss` and `js` concatenation and minification, [svgstore](https://www.npmjs.com/package/gulp-svgstore) for a svg system, image minification, browser-sync and file watching.  But for this site, I felt like that was a bit too much to handle while learning a new static site generator. So I decided to go with just using the npm [sass](https://www.npmjs.com/package/sass) package and use the scripts section of the `package.json` file.  This caused a bit of a headache when I deployed my app to Netlify, but ultimately it was everything I needed with no extra complexity. 

```js
// The scripts section of my package.json file
"scripts": {
    "watch:eleventy": "npx @11ty/eleventy --serve",
    "build-eleventy": "npx @11ty/eleventy",
    "watch:sass": "npx sass src/scss:_site/css --watch",
    "sass-build": "sass src/scss:_site/css",
    "dev": "npm run watch:eleventy & npm run watch:sass",
    "debug": "DEBUG=Eleventy* npx @11ty/eleventy",
    "eleventy-build": "npx @11ty/eleventy"
  }
```

## Deployed to Netlify
I deployed the last iteration of this site using GitHub pages.  While I never had a problem with GitHub pages I, again, wanted to learn a new technology.  I'd heard a lot about Netlify as a free hosting service. And, given the Zach Leatherman, the creator of Eleventy,  works at Netlify, I figured it was a good choice to try. I also was considering using [Netlify CMS](https://www.netlifycms.org/) for other projects so getting started was a good call (aparently Neflify CMS is no longer under active development). Netlify was a great choice.  You connect your GitHub Account to Netlify, they pull in your files and then you specify a build command. For my site all I needed was: `npm run eleventy-build && npm run sass-build`.  I set up a custom domain, set my site to auto deploy so that the site redeploys everytime I push to the main branch in the repo, and blam the site was up!  I've since deployed several more sites to Netlify and I'll ever look back. 

## Some final notes and the future 

A few more things really quick.  For a long time publishing posts from my work and home computers has been a bit of a pain.  I used git and GitHub to move from one machine to the other but, I often forgot to pull and push after or prior to working so I ran into a lot of merge conflicts that were a pain to fix.  Luckily now on GitHub pressing `.` while in a GitHub Repo starts up an online VS Code editor that you can edit, commit and push changes from any web browser.  No need for a CMS anymore as long as you are writing in Markdown. 

The one thing I liked about Jekyll that eleventy doesn't have out of the box is a system for drafts.  I used to make all of my posts drafts while I was working on them and only change them to publish once they had been edited (if I was going to edit them, that is).  For a while I searched around for how to implement this in Eleventy.  It can definitely be done.  But I've been learning more about Git workflows and I decided it is best to use branches for new draft posts.  So each post would get a unique branch.  Once a post is completed it will be pushed to the `main` branch to be pushed to be pulled into the production site on Netlify. 

The last thing I want to do is host some galleries of my design work and photography.  I'm sick of social media for the most part (maybe except for Twitter?) and I want this site to host all of my content.  I can't find a good image hosting service though.  My thought is that there has to be some sort of service that allows you to host images and some metadata using a nice GUI and then using a token fetch that data on your JAMstack site.  I haven't been able to find one though.  I started building one with Vue and express.js but haven't gotten very far. Another option I've recently been thinking about is using Wordpress Rest API.  I already know lots of wordpress so maybe that would be a simple way to get an image API up and running so that I don't have to learn something new with at least one part of the site.   

Anyway, that is my site update.  I basically used a very similar design as my old site but now the backend is an Eleventy site instead of a Jekyll. 

