---
layout: post
title: "2024 Wrap Up"
date: 2024-12-29
tags: "Year in Review"
---

So long 2024. 2024 was a great year for me. I feel, more than any other year, that I grew a lot personally and professionally. The year was highlighted by doing hard things with my wife and daughter and, for the most part, enjoying them. There was a lot that happened. I exercised a lot, drank less, came to terms with work, and spent a lot of time thinking about building a house. I also slept better for the most part, which is such a big win. I coded more at work and less at home which is something I'm going to try and do more of in the future. All in all it was a great year.

Here are some things I'm thinking about and reflecting on at the end of 2024.

## The Family

The most important part of 2024 for me was raising my daughter. This year my daughter transitioned from a helpless little nugget to a full-blown human being. We did so many new things together. We went to dozens of new parks, we went swimming, we went out to dinner, we went e-biking and to the river. We slept and we didn't sleep. We learned what is good to eat and cook and how to take breaks when we need it and how to lean on mamma and grandma when we need to and how to be there when mamma and grandma need a break. We learned how to ride strider bikes, and we ate a ton of bananas and cheese.

I spent so much less time on this computer because of my daughter, which was hard but also so good for me. I have zero regrets about spending less time on a computer.

My daughter is quickly becoming a small human and is slowly becoming more interactive. I'm loving communicating with her. She's bossy and has optionions and says "No" a lot. But she also says I love you and hugs and kisses more than ever and loves to run. I'm really excited for more of that this year. We are going to try and take Maddie skiing for the first time and on her first river trip. And I really want this year to be about camping. We live in such an amazing place and I'm excited about spending more time with Maddie outside.

## Work

In 2023, work was awful. I started a new job and that job was pretty terrible. There was a lot of stress due to the workload but also just because there were a lot of new people trying to figure things out with a few old people who weren't the best to work with. Some people I didn't get along with left at the end of 2024, and now I enjoy almost everyone that works at my office. I feel more on top of my job and am no longer trying to learn new things. All in all, I'm in a much better place with work now and am looking forward to this year. One thing that I think is good about how bad my job is, for the first time I was thinking about leaving the feds. I'm fairly good a programming and I think that I would be an asset to someone who needs a data person or web person. I applied to a data/web developer role but didn't get it. Unfortunately, there's lot of need for this type of person in the feds but not a lot of people who think they need it. The Forest Service is extremely old school.

A highlight from the year of work, and something that helped me get to a better place with the Forest Service a detail (for the non feds that's a temporary appointment) I did with a Planning Service Group. It was the first job I've had where I worked as a programmer daily. I loved it and it got me thinking that a more programming centric role would be good fit for me.

## Building a House

One of the most taxing and exciting things I did this year was build a house. We aren't done yet but we are getting close. And the truth is we really aren't actually building the house we have hired and architect and a general contractor to build the house for us. But none the less I feel like my wife and I have really hit our stride in this process. You hear the jokes about couples who build houses together fighting so much that they end up getting divorced. Well, I think my wife and I have grown closer to be honest. We aren't done yet, and there are a lot of interior design choices left but I think we are proving to be good partners when working on complex projects.

Seeing the house come to fruition has been wild. I've designed and built websites before, and I think my understanding of color theory has helped me with the process. But the spatial aspect of designing have been really hard for me to visualize. We've leaned heavily on my mom, who was a Interior Designer for a few decades, for most of the interior design stuff and I'm glad we have her because I'm not sure I trust most of my spatial design choices.

## Programming

### Lots of R

This year I embraced being an R programmer and focused less on web development. On my detail with the MPSG I worked on a data pipeline that made automated reports for Species of Conservation Concern evaluations. It was a crazy experience. In four months I pitched the idea, built the tools and output the reports. I had a lot of doubts that the whole thing would work and that people would buy into it. But in the end they did and it turned out better than I thought it would. The only bummer is I think they really would have liked to give me a permanent job but because the Forest Service Budget is so bad they could not. Hopefully that changes in 2025.

Two tools were really important to my success with the team. One was that I used a [targets](https://docs.ropensci.org/targets/) pipeline for the work I did with them. This really helped me keep things organized and in sync. Having a structure and "pipeline" helped me work through a large, relatively complex process in an organized way. I'm not sure I always need to use targets (I find myself using it and then not needing it sometimes) but for larger projects I think I'm going to use it more. The second tool I used was using packages to maintain repeatable steps. This process we developed had a lot of repetition. One of the most repeated steps was resolving taxonomies for species across many lists and occurrence records. This step we automated through a function in a package. [Codifying](https://github.com/fs-mschmidty/mpsgSE/blob/main/R/get_taxonomies.R) the process allowed lots of us to use the same process over and over and over. This seems like a duh realization but for me who mostly works by myself, it was extremely satisfying.

### Neovim

This year I also made the change from VS Code to Neovim and I think it was a large part of why I was successful at the MPSG. I'm a very distractable person. Neovim helps me stay in the editor and not moving from the mouse to the keys often helps me stay focused and on task. Neovim can also be a distraction so I had to be careful not to get too into my config file which I was mostly successful at. But there are so many nice customization's, from how you move from file to file, to how you add Zotero citations to a references.bib file in quarto and markdown, to how you check spelling. The customization's can be [quite addicting](https://github.com/mschmidty/nvim-config).

I've also become pretty obsessed with my terminal. I just started using Ghostty after using Wezterm for a while. I don't think it is good to change tools that often but I'm passionate about my tools so I'm not too upset that I've changed a few times lately. I was using VS code and warp terminal for a long time.

I think this year it would be good to familiarize myself with tmux although I'm always a bit reticent to use a tool that I can't use at both work and home.

## Life

### More Excersize

I exercised a lot in 2024 and I loved every minute of it. One of the hardest parts about moving to Durango and Building a house is that we are temporarily in a tiny house with a toddler and two 100 pound dogs. I spend a lot the day tripping over my dogs. So getting out and exercising was a must for me.

My 2024 exercise breakdown:

**Run**

- Time: 52h 48m
- Distance: 309.4 miles
- Elevation Gain: 26,993 ft
- Number of Activities: 58

**Ride**

- Time: 157h 53m
- Distance: 1,367.3 mi
- Elevation Gain: 199,909 ft
- Number of Activities: 73

I also logged 2 Rock Climbs, but I usually don't log those.

That is a lot of exercise. I'd like to see if I can exceed that number this year. The goal is total time really: So, we are shooting for more than 210 hours of exercise.

I think the goal is I really want to try and get really fit again, maybe do some bike races or running races in 2025. I'm not unfit but it's felt grate to start to get more fit this year and I'd like to keep that trend going.

## Looking Back at what I wanted from 2024

I set four goals for myself for 2024:

- Fewer Cell Phones and Tablets and Maybe Fewer Computers, Attempting to Truly Unplug.
- More writing
- More Time With Maddie and More Trips
- Find Time For Creativity

### Fewer cell phones, tablets and computers.

I definitely didn't succeed with fewer cell phones or tablets. I've mostly been off social media for the last few years with the exception of using Mastadon, and now BluSky, on my phone and Reddit and YouTube on my Tablet. But this year I found myself going down the rabbithole of YouTube shorts. An hour can go by and I can hardly realize that it has while watching YouTube shorts. I'm not sure how I feel about this moving forward. I think less tablets and phones is a good thing. I also think this comes up because I probably spend more time on my phone around this time of year than any other and when I write this I need a break. So mixed feelings about this moving forward.

As far as computer stuff goes, I did so much with my computer at work this year that I hardly touched my computer at home. This blog only had six posts. I'm OK with that. I'm building a house, raising a kid and working really hard. At some point I'd really like to get into a grove with writing. So I guess I kind of reached this goal using less computers.

As I said above I did less computer stuff in general. I also wrote less. It's so hard to find time with a two year old to write. I wrote six journal entries on a private blog and I wrote five posts to my daughter. I guess, in all that might be enough, 18 posts in total.

### More time with Maddie and more trips

We went on a lot of family trips this year. It didn't seem like that many but we did make it to a lot. We went to two big weddings, one in Oregon and the other in Mancos. The one in Oregon was Amazing, we went with my wife's family to the Oregon Coast and then to my wife's cousins wedding outside of Eugene. The Coast was spectacular. It was my daughter's first time at the beach and the first time we all flew as a family. We also went to Idaho with my family which was a 13 hour drive in total. We also got out and camped with Maddie which was great.

I think getting out more with Maddie will be a goal again this year.

### Find time for Creativity

I'm not sure that I did this at all. I didn't touch my camera. I hardly did anything artistic. I guess you could consider designing a house as something creative. I think it is. But raising a kid was my priority.

## Goals for 2025

I'm going to keep this simple this year and only have three goals:

1. Take Maddie on more trips.
2. Exercise as much as possible. I'd like to ride and run over 2,000 miles this year.
3. Grow as a programmer and keep applying to programming jobs.

Alright, that was a long one. Here we come 2025.
