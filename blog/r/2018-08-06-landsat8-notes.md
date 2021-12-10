---
layout: post
title:  "Working With Landsat8 Data from the USGS"
date: 2018-08-06
tags: [R, Landsat, GIS]
published: false
---

We are trying to monitor drought in sage-grouse habitat. Because we don't have historic on the ground data collection, I thought that it would be good to try and do this with landsat data. Landsat data is collected by the USGS and NASA about once ever 16 days.

The following are some notes on learning about the landsat dataset and how to access it in R.

## Packages
I used the [getlandsat](https://www.rdocumentation.org/packages/getlandsat/versions/0.2.0) r package.

Here are the specifications for downloading an image:

![landsat file specifications](/img/assets/images/landsat/landsat_code.PNG)

### Figuring out what tile you need.
The first thing you need to do if find out what tile of landsat data that you need. To do that, the dataset is stored in a file naming convention that allows you to query the data. The convention relies on the (World Reference System 2)[https://landsat.usgs.gov/what-worldwide-reference-system-wrs], for which a grid kml can be found (here)[https://landsat.usgs.gov/pathrow-shapefiles].

### Finding the groundstation IDs
The code for the US is LGN (Note: it shows on the site that the site name is LGS, which didn't work).  Others Can be founde (here)[https://landsat.usgs.gov/igs-network].

### Version - VV
The example I found uses: 00, so I used that as well. It worked, not sure why.

### File types - `_FT`
I used `_B5`.  I think this refers to the band of the image it is.  But I'm not sure.

## Downloading and using images

Like I said above, I used the [getlandsat](https://www.rdocumentation.org/packages/getlandsat/versions/0.2.0) r package.  It made downloading the data a bit easier.

I was interested in an area is southwest Colorado.  The Tile ID was ppp=036, rrr=033.  So my attributes were as follows:

| Description            | Value |
|------------------------|:-----:|
| Landsat                |   L   |
| Sensor                 |   C   |
| Mission                |   8   |
| Position - ppp         |  036  |
| Position - rrr         |  033  |
| Year                   |  2016 |
| Aquisition Day of Year |  008  |
| Ground Station         |  LGN  |
| Version                |   00  |
| File Type              |  _B5  |
| Extension              | .TIFF |

Using the lsat_image functions, my script to download the data was:
```r
lsat_image(x = "LC80360332015008LGN00_B5.TIF")
```
Now a few things that you can do.  First I just wanted to see the files.  The nice thing about the getlsatimages package is it caches your images in a file on your computer so that you don't have to download each image every time.  But its a little weird in that you have to load your images after downloading them from the cache.  You do this by first seeing what images you have in your cache:
```r
lsat_cache_list()

##[1]"C:\\Users\\mschmidt\\AppData\\Local\\landsat-pds\\landsat-pds\\Cache/L8/010/117/LC80101172015002LGN00/LC80101172015002LGN00_B5.TIF"
##[2]"C:\\Users\\mschmidt\\AppData\\Local\\landsat-pds\\landsat-pds\\Cache/L8/036/033/LC80360332015008LGN00/LC80360332015008LGN00_B5.TIF"
```

---
## Resources
* [Landsat Band Breakdown and Useful Combinations](http://gif.berkeley.edu/documents/Landsat%20Band%20Information.pdf)
* [Working With Landsat Imagery in R](http://rspatial.org/analysis/rst/9-remotesensing.html)
* [AWS Docs on Accessing Landsat](https://docs.opendata.aws/landsat-pds/readme.html)
