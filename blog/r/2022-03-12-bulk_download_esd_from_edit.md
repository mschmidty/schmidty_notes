---
layout: post
title: "Download all Ecological Site Descriptions for a MLRA from EDIT"
date: 2022-03-17
tags: [ "Ecological Site Descriptions" ]
---

I recently needed to download  Ecological Site Descriptions (ESD) for a large part of the area I work in.  The NRCS, Jornada Experimental Range and New Mexico State University have a handy website, [EDIT]https://edit.jornada.nmsu.edu/) that they provide all ESDs by Major Land Resource Areas (MLRA), wrapped in a nice user interface.  In the past I've just used the site to view and download the ESDs as I needed them.  But today I noticed that the EDIT website added a [Developer Resources](https://edit.jornada.nmsu.edu/resources/esd) section page. It even has examples in R. I figured it was time to get to know the EDIT API. 

The code below will download all ESD's in MLRA in Colorado. It is does the same thing as Tutorial 2 on EDITs website but uses tidy packages.

## Setup

For this example we use three packages: [tidyverse](https://www.tidyverse.org/) for pipes, dplyr, stringr and readr; [here](https://here.r-lib.org/) (you can probably skip this if you use Rstudio), and [janitor](https://garthtarr.github.io/meatR/janitor.html) to convert data frame headers to snake_case and fix ESD names.  

```r
library(tidyverse)
library(here)
library(janitor)
```

## Get a list of Ecological sites for a MLRA
```r
mlra<-'036X'
base_url <- "https://edit.jornada.nmsu.edu/services/downloads/esd/"

list_url <- paste0(base_url, mlra, "/class-list.txt")
ecoclasses <- read_tsv(list_url,  skip=2)%>%
  janitor::clean_names()
```

## Use `stringr` to filter just colorado sites
```r
co_classes<-ecoclasses%>%
  filter(str_detect(ecological_site_id, "CO$"))
```

The result should look like this:

```r
# A tibble: 21 x 4
   mlra  ecological_site_id ecological_site_legacy_id ecological_site_name 
   <chr> <chr>              <chr>                     <chr>
 1 036X  R036XY038CO        R036XY038CO               Wet Meadow
 2 036X  R036XY110CO        R036XY110CO               Shallow Clay Loam - ~
 3 036X  R036XY111CO        R036XY111CO               Steep Shallow Clay L~
 4 036X  R036XY113CO        R036XY113CO               Semidesert Juniper L~
 5 036X  R036XY114CO        R036XY114CO               Mountain Pinyon      
 6 036X  R036XY141CO        R036XY141CO               Shallow Loamy Mesa T~ 
 7 036X  R036XY142CO        R036XY142CO               Loamy Mesa Top - (Pi~ 
 8 036X  R036XY266CO        R036XY266CO               Salt Meadow
 9 036X  R036XY284CO        R036XY284CO               Loamy Foothills       
10 036X  R036XY287CO        R036XY287CO               Stony Foothills       
# ... with 11 more rows
```

## Make it loopable
We then need to a write a function that we can reuse in a loop. We will loop over each row of the `co_classes`  dataframe using the `by()` function. The function will build a url to each ESD pdf that we want to download and then download the file at that url.

```r
download_esd<-function(x, mlra, output_path){
  base_url <- "https://edit.jornada.nmsu.edu/services/descriptions/esd/"
  doc_url<-paste0(base_url, mlra, "/", x$ecological_site_id, ".pdf")
  download.file(doc_url, paste0(output_path,"/",x$ecological_site_id," - ", janitor::make_clean_names(x$ecological_site_name),".pdf"), mode="wb") ## janitor:: here is necessary because some of the names have characters that are not safe for fiel names.
}
```

You can test everything is working with: 
```r
download_esd(co_classes[1,], mlra, here("output", "test")) ## Make sure that output/test is an actual folder!
```

Instead of `here("output", "test")` you can also just use `"output/test"` if you are in Rstudio.  

## Loop away
Now we just need to loop over the dataframe and download each one. 

```r
#create a folder ouput/co or whatever you choose before running
by(co_classes, seq_len(nrow(co_classes)),download_esd, mlra, here("output", "co")) 
```

And boom, you should have a folder with all of the ESDs for Colorado in MLRA36. 








