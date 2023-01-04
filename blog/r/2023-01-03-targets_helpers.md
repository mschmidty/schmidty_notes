---
layout: post
title: "A few helpers for working with the {targets} package in R."
date: 2023-01-03
tags: [ "targets" ]
---


## Start a {targets} project

```r
targets::use_targets()
```

## The most important targets commands to remember

```r
tar_make() ## Runs your targets workflow
tar_load_everything() ## loads targets so you can view and work with them. 
tar_manifest() ## overview of your targets
tar_visnetwork() ## a visual tree of your targets
tar_delete(name_of_target) ## deletes 'name_of_target' target.
```

## VS code keyboard shorcuts
Below are a few keybindings I added to VS Code. They run `tar_make()` with control+shift+M and `tar_load_everything()` with control+shift+L in the terminal. These are the commonds that I use the most.  add the following to your VS Code json (ctrl+shift+p and search "keybindings json"). 

```json
{
    "key": "ctrl+shift+m",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "tar_make()\u000D"
    }
},
{
    "key": "ctrl+shift+l",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "tar_load_everything()\u000D"
    }
}
```

## Outputing a file

In your `_targets.R` `list()`: 

```r
list(
    ##>>>> Other targets above making data...
    tar_target(output, output_func(data, ouptput_path), format="file")
)
```

And then your function file in the `/R` directory would look like this: 
```r
output_func<-function(data, output_path){
    write_csv(data, output_path)
    output_path ## you must return an output path so that the file can be tracked. 
}
```



