---
layout: post
title:  "How to download and work with LSAT data -  a better approach"
date: 2018-08-13
tags: [R, Landsat, GIS]
---

My last post was about working with the r `getlandsat` package to work with landsat data from NASA and the USGS.  This post will be a brief refinement on that process.

## Finding out what dataset you want?
With this method, your first step is figuring out what tyle you want from the Landsat dataset. The convention relies on the [World Reference System 2](https://landsat.usgs.gov/what-worldwide-reference-system-wrs), for which a grid kml can be found [here](https://landsat.usgs.gov/pathrow-shapefiles) that you can view in Google Earth.

In my case I needed tile path = 036 and row = 033.

## Figuring out what images are available for your tile.
Amazon provides an API to download all of the images.  To figure out what scenes are available, Amazon provides a scene list. I used R to view and subset the scene list:
```r
library(dplyr)

file<-"https://landsat-pds.s3.amazonaws.com/c1/L8/scene_list.gz" ##create variable that equals the scene list zip file.
scene_list<-read_csv(file) ##unzip and read the scene list with the package dplyr.
scene_list %>%
  filter(path==036 & row==033 & cloudCover<20) ##View Scene list, subsetting results by path and row. I also subsetted the scenes to scenes with less than 20% cloud cover.
```
based on this, I decided I wanted `https://s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/index.html`.  That is just a webpage with a bunch of links to raster tile band. To work with the landsat data, we want the first 7 bands, but it is easiest to just download all of the the links.  To do this we use a handy terminal command called `wget`.  Which essentially downloads all of the link contents on the index page.

To perform the download type open the terminal on mac or download git for windows, `cd` into the folder you wish to download the files to and type:

```bash
wget -r -p https://s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/index.html
```
This will download all the tiles to the folder. For more on wget, check out the [man pages](http://manpages.ubuntu.com/manpages/bionic/en/man1/wget.1.html). Each tile download is about 1Gb, so the download may take a while.

### downloading a list of URL files with wget
```bash
wget -r -p -i text_file_name.txt
```

## Creating a raster brick and using the data

The best way to get the data and use it once it is downloaded is to create a list of all of the file locations for the tiles.  Because the file names and locations will all be the same, we can us `paste0` in r to make a list and then turn that list into a raster brick.

```r
raslist<-paste0("s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B", 1:7,".tif")
raslist
```
Your output should look like this:

```r
##[1] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B1.tif"
##[2] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B2.tif"
##[3] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B3.tif"
##[4] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B4.tif"
##[5] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B5.tif"
##[6] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B6.tif"
##[7] "s3-us-west-2.amazonaws.com/landsat-pds/c1/L8/036/033/LC08_L1TP_036033_20180609_20180615_01_T1/LC08_L1TP_036033_20180609_20180615_01_T1_B7.tif"
```
We can then use the `raster` function `stack()` to create a raster brick (merge all of the separate landsat tiffs).

```r
library(raster)
landsat<-stack(raslist)
landsat

## class       : RasterStack
## dimensions  : 7771, 7641, 59378211, 7  (nrow, ncol, ncell, nlayers)
## resolution  : 30, 30  (x, y)
## extent      : 533685, 762915, 4190385, 4423515  (xmin, xmax, ymin, ymax)
## coord. ref. : +proj=utm +zone=12 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0
## names       : LC08_L1TP//5_01_T1_B1, LC08_L1TP//5_01_T1_B2, LC08_L1TP//5_01_T1_B3, LC08_L1TP//5_01_T1_B4, LC08_L1TP//5_01_T1_B5, LC08_L1TP//5_01_T1_B6, LC08_L1TP//5_01_T1_B7
## min values  :                     0,                     0,                     0,                     0,                     0,                     0,                     0
## max values  :                 65535,                 65535,                 65535,                 65535,                 65535,                 65535,                 65535
```

Now we can view the data using `plotRGB` creating two compostites.

```r
par(mfrow = c(1,2))
plotRGB(landsat, r=3, g=2, b=1, axes=TRUE,  stretch="hist", main="Landsat True Color Composite")
plotRGB(landsat, r=5, g=4, b=3, axes=TRUE,  stretch="lin", main="Lansat False Color Composite")
```

## Resources
* [University of Colorado Tutorial on working with landsat](https://www.earthdatascience.org/courses/earth-analytics/multispectral-remote-sensing-data/landsat-data-in-r-geotiff/)
