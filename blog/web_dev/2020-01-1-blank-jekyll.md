---
layout: post
title:  "New Jekyll Project With No Theme and No Posts, Just Scafolding"
date: 2020-01-11
published: true
tags: [jekyll, static sites]
---

I use Jekyll to make this site.  I've toyed with converting the site to a Wordpress site but I much prefer writing in a text editor.  I also love that I can write `<html>` or `js` wherever I want in a file with syntax highlighting. I also use Jekyll to quickly prototype ideas. For this I'm looking for a bare bones Jekyll install.   

In the past when I started a Jekyll project I ran `jekyll new projectName`  which gives you a ready to go blog and hides some functionality for simplicity sake. But I usually want all of the functionality and none ready blog stuff.    

In walks the `--blank` flag.  If you add `--blank` to your site install Jekyll gives you everything you need to make a Jekyll site, but no extras.  You get just the basics.  

First, I had a new macOS on my machine and it broke jekyll.  If you use jekyll on mac make sure you go through the [macOS install instructions](https://jekyllrb.com/docs/installation/macos/) (in my opinion it is deceiving that they have other instructions on their home page).

As of version `4.0.0` `--blank` comes with a lot more then it used to.  So update Jekyll if you have an old version.  

## Setting up Jekyll --blank

```bash
jekyll new projectName --blank
cd projectName
```
With a standard Jekyll install you would now just run `bundle exec jekyll serve`. If we do that we get an error:

```bash
Could not locate Gemfile or .bundle/ directory
```

Googling around I found [this issue](https://github.com/jekyll/jekyll/issues/6693) on github (thank you davatron5000 - shout out to [shoptalk](https://shoptalkshow.com/)). At the bottom is the solution:

```bash
bundle init
bundle add jekyll
```
And you're ready to go.

```bash
bundle exec jekyll serve --livereload
```

And a beautiful blank slate of Jekyll awesomeness appears.







