---
layout: post
title: "VS Code: Add a Rmarkdown Code Chunk Snippet Key Binding"
date: 2021-09-28
tags: [ R, Rmd, "VS Code" ]
published: true
---

I recently started using VS code for [R](https://www.r-project.org/) development. There is an awesome newish [R extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Ikuyadeu.r).  It takes a little setup, it works best with the addition of radian, a python package, but otherwise it works really well. There are solid instructions on the extension page. I love [Rstudio](https://www.rstudio.com/) for the most part, but I got frusterated by the lack of editor customization (mostly line height). So here we are.  

One thing that the the VS code R package does not have is a shortcut for adding Rmarkdown code chunks with `ctrl+alt+i`. I couldn't find an easy solution after googleing so I thought I'd write a short "how to" in case others needed something similar. 

## Adding the Snippet

Go to `Code>Preferences>Keyboard Shortcuts` and then in the upper right hand corner there should be a small icon that looks like a piece of paper with a arrow coming around it.  If you hover on it, it says "Open Keyboard Shortcuts (JSON)". Click on it to open the "Keyboard Shortcuts.json" file.  You can also press `cmd+shift+p` and type in "Keyboard Shortcuts" and select "Preferences: Open Keyboard Shortcuts (JSON)".  Edit the .json file with the following json.

```js
[
  {
    "key": "cmd+alt+i", # On windows: "ctrl+alt+i". 
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {"snippet": "```{r}\n$0\n```"}
  },
]
```

Now you can add a Rmarkdown code junk just like Rstudio with `cmd+alt+i`. 

## Options Code Chunk

I often use an options at the top of my code Rmarkdown files to set max print or use "quartz" as my graphics device ("windows" on pc).  You can similarly map a an options code chunk with: 

```js
[
  //....Previous Code chunks
  ,
  {
    "key": "cmd+alt+o", # On windows: "ctrl+alt+o". 
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {"snippet": "options(\n  max.print=100,\n  vsc.use_httpgd=TRUE,\n  device='quartz'\n)"}
  }
]
```

## Rmarkdown yaml and setup with pagedown.

```js
[
  //...Previous Code Chunks
  {
    "key": "ctrl+alt+m",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args":{
      "snippet": "---\ntitle: '$0'\nauthor: 'Michael Schmidt'\ndate: '`r Sys.Date()`'\noutput:\n  pagedown::html_paged:\n    self_contained: false\n    toc: false\n---\n\n```{r setup, include=FALSE}\nknitr::opts_chunk\\$set(\n  echo = FALSE,\n  message = FALSE,\n  warning=FALSE\n)\n```"
    }
  }
]

```