---
layout: post
title: "Creating a polygon from scratch in R"
date: 2019-02-14
tags: [ GIS, R ]
---

A quick little snippet for making a polygon with coordinates out of thin air in r.

```r
library(sp)
library(rgdal)

## Create x and y vectors with coordinates and bind them together.
x_coord <- c(140347.2, 140347.2, 349558.4, 349558.4)
y_coord <- c(4094871, 4244715, 4244715, 4094871)
xym <- cbind(x_coord, y_coord)
xym

## Convert the points into a polygon
p = Polygon(xym)
ps = Polygons(list(p),1)
sps = SpatialPolygons(list(ps))

## give the Spatial Polygon a projection.
proj4string(sps) = CRS("+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")
data = data.frame(name="model_extent")
spsdf <- SpatialPolygonsDataFrame(sps, data)
plot(sps)

## Write the polygon to a file.
writeOGR(spsdf, "output", driver="ESRI Shapefile", layer="extent_of_model")

```
