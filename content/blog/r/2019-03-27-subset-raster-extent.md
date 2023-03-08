---
layout: post
title: "Subset Raster Extent w/ R"
date: 2019-03-27
tags: [ raster, R ]
published: true
---

A little snippet that helps subset raster extents.

```r

r<-raster(res=1)
extent(r)<-extent(1,20, 0,30)

xmin<-r@extent@xmin
xmax<-r@extent@xmax
ymin<-r@extent@ymin
ymax<-r@extent@ymax

list_of_extents<-list()
n<-4 ##or whatever
for(i in 1:(n-1)){
  list_of_extents[[i]]<-extent(xmin, (xmax-xmin)/n*i+xmin, ymin, ymax)
}


list_of_extents

.... returns ...
[[1]]
class       : Extent
xmin        : 1
xmax        : 5.75
ymin        : 0
ymax        : 30

[[2]]
class       : Extent
xmin        : 1
xmax        : 10.5
ymin        : 0
ymax        : 30

[[3]]
class       : Extent
xmin        : 1
xmax        : 15.25
ymin        : 0
ymax        : 30

```
