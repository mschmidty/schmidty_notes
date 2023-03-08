---
layout: post
title: "First R Package"
date: 2020-08-26
tags: [ R, package ]
published: true
---

I've been trying to participate in [#tidytuesday](https://github.com/rfordatascience/tidytuesday).  While making plots I found myself consistantly repeating the same `theme()` attributes for each plot.  To solve this repetition, I decided to produce a package with my own theme. 

The following is the very basics of how to make package with a very minimal theme for personal use.  The focus will be on making a package  and not on theme development.  This also assumes you are using [Rstudio](https://rstudio.com/products/rstudio/#rstudio-desktop) as your IDE. When we are done you should have a package that you can load into any R script by running `library(packageName)`. 

## Getting started with your first package
To start your package, in Rstudio go to "File">"New Project" and the "New Project Wizard" dialogue box should appear. 

![Photo of New Project Wizard](/img/r/assets/package/new_project_wizard.JPG)

Select "New Directory" and then "R Package". Fill in the package name and select "Create Project".

![Photo of Create Project Steps](/img/r/assets/package/package_create.JPG)

Rstudio creates a full fledged package for you.  

## What's in a package

```bash
├─ .Rbuildignore 
├─ projectName.Rproj 
├─ DESCRIPTION
├─ man/
│   └─hello.Rd
├─ NAMESPACE
├─ R/
│   └─hello.R
```

For now, talking about packages on a really basic level, the only files we need to care about are the `.R` files in the `R/` folder. It is a good idea to add documentation to your package, but for now, to keep things simple we are going to ignore documentation. 

## Adding a function to your package
To add a function to our package create a new `.R` file in your `R/` folder. I will name mine `theme.R`.  Within the file I am going to save a simple theme: 

```r
background_color<-"#f9f9f9"

theme_schmidt <- function () {
  theme_minimal() %+replace%
    theme(
      plot.margin = margin(20, 20, 20, 20),
      plot.background = element_rect(fill=background_color),
      panel.background = element_blank(),
      panel.grid.major.x = element_blank(),
      panel.grid.major.y = element_blank(),
      panel.grid.minor.x = element_blank(),
      axis.line=element_blank(),
      axis.ticks.y = element_blank(),
      axis.text = element_text(size = 9),
      axis.title = element_text(size=11, color="#888888"),
      plot.title = element_text(size = 12,
                                color="#333333",
                                face="bold",
                                margin = margin(10, 0, 3, 0)),
      plot.subtitle = element_text(size = 8,
                                   color = "#888888",
                                   face = "italic"),
      plot.caption = element_text(size=8,
                                  color = "gray50",
                                  margin = margin(10, 0, 0, 0),
                                  hjust=1)
    )
}
```
The file has one function `theme_schmidt()`.  

## Adding the theme to library()
To add any package to your library make sure everything in your package is saved and press `cmd`+`shift`+`B` (`ctrl`+`shift`+`B` on windows).  Rstudio will compile your package and add it to your library.  Now whenever you want to use your new theme you just have to call `library(packageName)` and then `theme_set(theme_schmidt())` will be ready to use. 

## Hosting your package on GitHub 
If you want you can put your package on github.  All you need to do is push your entire package structure to github.  Then when you want to access it, like for example if you update your version of R, you can download it using the [devtools](https://www.rdocumentation.org/packages/devtools/versions/1.13.6) package.

```r
devtools::install_github("username/repository_name") 
devtools::install_github("mschmidty/schmidttheme") ##downloads the above package. 
```

The above code should download your package into R your library.  Of course, it is a good idea to document your package prior to pushing it out to the public. 

## Final thoughts
Developing my first package was way easier than I expected.  I've been working on a large multi-year project that I use `source()` to load functions from an `R/` directory. Most of the time this works OK, but handling dependencies and documenting my functions is a pain.  I will likely be relying on packages in the future to tidy things up. 

## Resource
* [R Packages by Hadley Wickham](https://r-pkgs.org/)