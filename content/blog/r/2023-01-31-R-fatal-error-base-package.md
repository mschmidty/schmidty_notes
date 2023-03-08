---
layout: post
title: "R - Fatal Error: Unable to open the base package"
date: 2023-01-31
tags: [ "Debugging" ]
---

On my Windows work computer I was having a weird problem where R would break after I restarted my computer.  The basics of the problem were: I installed a new version of R, version 4.2.2 to be exact, R would work until I would restart my computer. After that when I started R it would crash I would get an error `Fatal Error: Unable to open base package`. For weeks I googled around and most of what I could find had to do Rstudio not finding the right version of R.  Based on what I found I deleted all of my .Rprofile and .Renviron files that I could find.  I deleted all the old versions of R on my machine. Nothing worked.  I reinstalled R version 4.2.2 like 5 times. Still the same problem.  I even installed R on an external hard drive because I thought that my work proxy was doing something weird. 

Exasperated I reached out on Mastadon: 

<p><iframe src="https://fosstodon.org/@mschmidty/109784504741280583/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://fosstodon.org/embed.js" async="async"></script></p>

And behold, the hive mind found the problem.  

<p><iframe src="https://fosstodon.org/@datamaps/109784868982539457/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://fosstodon.org/embed.js" async="async"></script></p>

The problem was that I had old versions of R in my registry keys.  Part of the problem was that I had been deleting my old versions of R and not uninstalling them.  You can manually delete your registry keys by Start>Run and typing "regetit" and hitting OK. I could not do this because my Work IT folks blocked me from even viewing the keys to see if they were the problem.  Lucky for me I hadn't deleted the old version sof R from my recycle bin.  I restored them and uninstalled each one including the most recent version.  I restarted then reinstalled R and haven't had the problem since.  

Thanks to those who lent a hand on Mastadon.

