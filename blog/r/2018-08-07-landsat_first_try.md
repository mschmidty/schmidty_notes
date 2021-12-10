---
layout: post
title:  "Landsat First Try"
date: 2018-07-31
tags: GIS
---

```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = TRUE)
```


## Download Libraries
```{r}
library(getlandsat)
library(raster)
library(tidyverse)
```
##
```{r}
res<- lsat_scenes(n_max=20)
res
```

## Testing Downloading imagery
```{r}
lsat_image(x = "LC80360332015008LGN00_B5.TIF") ## Works
lsat_image(x = "LC80101172015002LGN00_B5.TIF") ##Works
lsat_image(x = "LC80360332015008LGN00_B5.TIF")
lsat_image(x = "LC80360332015008LGN00.TIF")
```

##
```{r}
lsat_cache_list()
```

## Using the file
```{r}
x<-lsat_cache_details()[[2]]
img<-raster(x$file)
summary(img)
plot(img)
```


## Raster Info
```{r}
crs(img)
```

```{r}
res(img)
dim(img)
```
