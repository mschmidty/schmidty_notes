library(rgeos)
library(raster)

#####################################
#### Distance to a Polygon
#################################### 
## make raster
r<- raster(ncol=200, nrow=150, xmn=-1000, xmx=1000, ymn=-100, ymx=900)
rr<-setValues(r, 0)


## create polygon
x<- c(300, 500, 400, 289, 250)
y<- c(300, 80, 20, 50, 80)

poly1<-SpatialPolygons(list(Polygons(list(Polygon(data.frame(x,y))), ID=1)))

x<- c(-500, -700, -600, -589, -450)
y<- c(400, 180, 120, 150, 180)
poly2<-SpatialPolygons(list(Polygons(list(Polygon(data.frame(x,y))), ID=1)))
poly<-bind (poly1, poly2)
plot(poly)

## Mask raster by the geometry of the polygon

rrr<-mask(rr, poly)


## Calculate the distance
rD<- distance(rrr)
plot(rD, 
     legend.args=list(text='Distance (m)', side=4, line=3, cex=0.8))
plot(poly, add=T)



#####################################
#### Distance to a line
####################################

## Make the same raster as above
r<- raster(ncol=100, nrow=75, xmn=-1000, xmx=1000, ymn=-100, ymx=900)
r<-setValues(r, 0)


##Make two lines
lines<-SpatialLines(list(
  Lines(list(Line(cbind(c(300, 500, 400, 289, 250), c(300, 80, 20, 50, 80)))), ID="a"),
  Lines(list(Line(cbind(c(-500, -700, -600, -589, -450), c(400, 180, 120, 150, 180)))), ID="b")
))
plot(lines)

##Calculate Distance from Raster to lines
distance<-gDistance(lines, as(r, "SpatialPoints"), byid=TRUE)
r[]<-apply(distance,1, min)

r<-disaggregate(r, fact=2)

plot(r,
     legend.args=list(text='Distance (m)', side=4, line=3, cex=0.8))
plot(lines, add=T)


#####################################
#### decreasing raster resolution, disaggregating, and then adding to regular raster resolution. 
#####################################

## Make the same raster as above
rr<- raster(ncol=200, nrow=150, xmn=-1000, xmx=1000, ymn=-100, ymx=900)
rr<-setValues(r, 0)

r1<- raster(ncol=100, nrow=75, xmn=-1000, xmx=1000, ymn=-100, ymx=900)
r1<-setValues(r1, 1)

r1_ag<-disaggregate(r1, fact=2)




