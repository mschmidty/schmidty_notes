---
layout: post
title: "A few helpers for working with the {targets} package in R."
date: 2023-01-31
tags: [ "targets" ]
---

I started to use the [`{targets}`](https://books.ropensci.org/targets/) package for some of my larger projects.  It was a little challenging for me to wrap my head around but after working through some initial problems I think it will help me stay organized and write code in a more composable way.  Below are a few notes that I needed to keep coming back to when I was getting started. If you need a comprehensive `{targets}` getting started I suggest the targets book linked above or in the References section below. 

## Start a {targets} project
In an empty or existing R project directory run: 
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

## VS code keyboard shortcuts
Below are a few keybindings I added to VS Code. They run `tar_make()` with control+shift+M and `tar_load_everything()` with control+shift+L in the terminal. These are the commands that I use the most.  add the following to your VS Code json (ctrl+shift+p and search "keybindings json"). 

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
    tar_target(output, output_func(data, output_path), format="file")
)
```

And then your function file in the `/R` directory would look like this: 
```r
output_func<-function(data, output_path){
    write_csv(data, output_path)
    output_path ## you must return an output path so that the file can be tracked. 
}
```

## Rmarkdown
To start using Rmarkdown you need the [`{tarchetypes} package`](https://github.com/ropensci/tarchetypes).  Load it right under the `{targets}` package in your `_targets.R` file with `library(tarchetypes)`.

Then to render a Rmarkdown documents in your targets list you can use `tar_render()`.

```r
list(
  ## More targets above
  tar_render(documantation, "Rmd/documentation.Rmd")
  ## More targets
)

```

Within the Rmarkdown file things are a little different.  The two I've used the most are: 

```r
tar_read(name_of_target) ## Loads an R object such as a tibble or sf object.
tar_load(name_of_target) ## Loads a plot for example. 
```


## Spatial Rasters from the `{tera}` package had problems
One problem I had with working with targets is, I work with a lot of spatial grid data.  I've been using the [`{terra}`] package as my go to grid package.  However a bit stumbling block for me was you can't write a SpatialRaster as a targets object.  Or at least I couldn't figure out how.  I put up a [question on Stack Exchange](https://stackoverflow.com/q/74855695/3088902) and the terra package maintainer was kind enough to respond. But we never got to a resolution.  

I also reached out on Mastadon and Miles McBain, Targets evangelist, was kind enough to get back to me, but also no resolution. 

<iframe src="https://fosstodon.org/@mschmidty/109542366237497578/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://fosstodon.org/embed.js" async="async"></script>

Well that all for now. 

## References
* [Targets Book](https://books.ropensci.org/targets/)
* [Targets on CRAN](https://cran.r-project.org/web/packages/targets/index.html)


