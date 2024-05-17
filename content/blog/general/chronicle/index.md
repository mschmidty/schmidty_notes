---
layout: post
title: "Chronicle I" 
date: 2024-04-14 
tags: "Chronicle"
---

In my last post I wrote about how I started blogging because of Chris Coyier.  In this post I'm going to copy something he used to do, which was a post a "Chronicle". A Chronicle was essentially just a list of the things he was using in his day-to-day work at that moment or anything else he wanted to share.  I'm going to do the same here and, hopefully, in the future. 

## {`targets`}
Probably the biggest addition to my workflow lately is the [`targets`](https://books.ropensci.org/targets/) R package. Targets is a "Make-like pipeline tool for statistics and data science in R". It's an opinionated-ish workflow and structure for your R projects. It sets up functional based structure. It also writes objects as you go, so both inputs and outputs are tracked and outputs are stored. Also the relationship of between objects is tracked. If any input/output is changed it will run any function that relies on the changed output. It is also relatively structured.  This is very helpful to me day to day at work. At work, I work on a variety of projects at any given time which means that I start projects, get to a point, move on to something else only to come back weeks or months later to any given project.  Prior to using targets I would open up an old Rmarkdown document and it would take me a bit to re-remember what I was doing and where I was. Sometimes I would forget all together  Targets has helped me because it requires you to functionally program, working in chunks.  This is helpful because whenever you re-open a project you know where each target ends and how they relate to one another in a relatively small body of text.  A basic target pipeline works something like this:
```r
list(
  tar_target(name_of_product, name_of_function_to_make_produce(function_input)),
  tar_target(product2, function2(name_of_product))
)
```
There's a lot more to it, but I'd give it a try if you find yourself getting lost in your code or if you write code where lots of things rely on each other in complex ways and you need help keeping track of everything. 

## Notion Calendar (Formerly Cron)
I've never really been a calendar person.  In part, I have never really needed to be a calendar person. I've been lucky enough to have very few obligations in my life.  The obligations that I did have never needed a calendar for scheduling.  I could keep all of my time commitments in my head for the most part. But things have changed.  My job is busier, and my life is way busier. Enter [Notion Calendar](https://www.notion.so/product/calendar) (when I started using it, it was called Cron).  It's simple, easy to navigate on my phone and just works all the time. 

## Zotero
I've always had to read a lot of scientific papers and other PDFs at work. At first, I organized them in Evernote, then switched to Notion and then finally found [Zotero](https://www.zotero.org/). The reading experience, highlighting and note-taking are all excellent.  But the biggest benefit Zotero provides to me is the citation management features. There is a plugin for almost any writing app Obsidian, Notion, and Microsoft Word. So you can look up citations in any document input them and the bibliography is automatically built for you. I haven't found a smooth way to input citations and bibliographies in VS Code yet, but whenever you have a paper open in Zotero you can press cmd+shift+a to copy the short citation (Schmidt, 2024) or press cmd+shift+c to copy an entire bibliography entry. 

## Microsoft Word
After avoiding Microsoft Word, I've finally realized that I need to embrace it.  And honestly, I'm extremely glad that I have.  I've found that a lot of the time I can get more done in Microsoft Word than any other writing application.  And it's integration with Zotero for references was a game changer.  It's kind of sad that it took me this long to get good at Microsoft Word. I didn't need to learn much.  Mostly just learning how to create a theme, link tables and figures to references, how to handle citations with the Zotero plugin and format tables. The rest is just writing. 

## Quarto
But I haven't completely given up on markdown authoring.  I've also been really enjoying working with [Quarto](https://quarto.org/docs/get-started/) as a replacement for Rmarkdown.  I don't know that they are all that different, but I did seamlessly transition from Rmarkdown to Quarto. Furthermore, I really like the live reload feature that will rewrite an HTML doc every time you save your qmd.  I also have finally figured out how to use a refernce.docx that sets a theme for a word doc.  I am the only person who codes at my office, so I like to output all of my .qmd docs to .docx for those who come after me.  

That's at least some of the things I'm loving right now.  I feel like I work with these programs and applications almost every day.  
