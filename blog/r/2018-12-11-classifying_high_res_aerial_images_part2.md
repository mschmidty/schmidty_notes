---
layout: post
title:  "Classifying High Resolution Aerial Imagery - Part 2"
date: 2018-12-01
tags: [ GIS, R, Remote Sensing ]
---


I have been attempting to use random forests to classify high resolution aerial imagery. [Part one](r/2018-11-20-classifying_high_res_aerial_images) of this post series was my first attempt. The aerial imagery dataset that I am working on is made up of many ortho tiles that I need to classify into vegetation categories.  The first attempt was to classify vegetation on one tile.  This note documents classifying vegetation across tiles.

See the r script below.

## Notes

### Set Up

The training polygon shapefile consists of 8 classes (it should be 7  but I accidentally used two names for bare ground: "BG_Soil" and "BG_Rock").

### The Results

The out of bag (OOB) estimate of error rate was 1.85% which is pretty good.  However, the training dataset has very imbalanced classes.  

| Class | Percent Cover |
|-------------|---------------|
| BG_Rock | 25.6 |
| BG_Soil | 24.7 |
| Black_Sage | 1.7 |
| Grass | 4.1 |
| Other_Shrub | 1.5 |
| Other_Veg | 15.2 |
| PJ | 24.2 |
| Sage | 2.9 |

Classes were very imbalanced in the training dataset.  Both "BG_Soil" and "BG_Rock" should be combined making soil account for over 50% of the area.
{: .caption}

You can see the class imbalance in the confusion matrix as well.

|  | BG_Rock | BG_Soil | Black_Sage | Grass | Other_Shrub | Other_Veg | PJ | Sage | class.error |
|-------------|---------|---------|------------|-------|-------------|-----------|--------|-------|-----------------------|
| BG_Rock | 148953 | 145 | 2 | 24 | 12 | 3 | 1 | 7 | 0.0013007301521318348 |
| BG_Soil | 148 | 141975 | 206 | 472 | 768 | 40 | 51 | 289 | 0.01371319008815619 |
| Black_Sage | 8 | 244 | 8283 | 254 | 145 | 18 | 67 | 863 | 0.1618093503339405 |
| Grass | 25 | 174 | 155 | 23514 | 11 | 14 | 1 | 32 | 0.0172197609295327 |
| Other_Shrub | 3 | 531 | 61 | 5 | 7993 | 4 | 7 | 1 | 0.07112144102266127 |
| Other_Veg | 1 | 137 | 34 | 87 | 24 | 86021 | 2195 | 9 | 0.028099154878654997 |
| PJ | 0 | 78 | 203 | 8 | 24 | 688 | 139218 | 708 | 0.012126845813790088 |
| Sage | 0 | 247 | 1091 | 108 | 9 | 4 | 318 | 15315 | 0.10396676807863325 |

The most difficult divisions for the random forests was between "Black_Sage" and "Sage".  Which makes a lot of sense.  About 6.3% of the time Sage was classified as Black_Sage, out of a total error of 10%, and about 8.7% of the time "Black_Sage" was classified as Sage, out of a total error of 16%.    

### Making Improvements (Iterate or Die)

**Class Size:** Obviously, I need to improve the class balance.  I think the best way to do this is to both draw more training polygons in those classes with less (black_sage, sage and other_shrub) coverage and two add a balancing step in the script. Which brings me to `sampsize()`.

**Sample Size** I also need to take advantage of randomForest's ability to manage sample size with `sampsize()`.  I have had a hard time automating the sample size to be used in the function so that I don't have to find the smallest class and then manually put in that number as many times as there are classes. For instance if I had five classes and the minimum class size was 500 pixels I would need to set sampsize to be `sampsize(500,500,500,500,500)`.  Or I could sample the combined training set by randomly sampling pixels before I run random forests.

**Segmentation** - I still think segmentation has a role to play in this classification process, but my first attempt at segmentation was a complete failure.  I need to find a tutorial on classification before I can make any improvement.  

**Adding Data** - Using only five variables, red, blue, green, alpha, and ndvi, seems like very little data to classify imagery. There are a few datasets that I am considering adding:
* Soils data
* Elevation type data (slope, flow direction, terrain roughness, etc. )
* Landfire data, which is essentially landsat data that has been classified.

But if this process is going to scale to the rest of the state, the datasources that I use need to be available to everyone.

## Scripts

```r

## Load libraries
require(dplyr)
require(stringr)
require(raster)
require(rgdal)
require(rgeos)
require(randomForest)



## Function to work subset training dataset of one tile
# - inputs (all are automatically created by build_model):
# -- tile_name: is the name of the tile from a single iteration in the list
# -- folder_of_tiles: is the directory that all of the tiles are stored.
# -- file_path_to_shape: the path to the shapefile that will classify.
# - steps:
# -- RASTER STEPS
# -- read raster brick
# -- change names to b1 to b4 for each band
# -- create an NDVI layer
# -- combine NDVI to four Bands
# -- renmae each band
# -- SHAPEFILE STEPS
# -- split file path name
# -- read shapefile with split filepath
# -- Don't know what the layer paste is all about, I think I can take it out.
# -- convert Class, the supervised classes for training, to numeric
# -- clip the shapefile to the extent of the loaded tile.
# -- rasterized the clipped shapefile with values being class.
# -- rename heading to class
# -- remove temporary variables
# -- MORE RASTER STEPS
# -- clip the raster to the shapefile extent
# -- add training raster (converted shapefile) to the ortho raster data.
# -- convert raster to values (table)
# -- convert values to data.frame, the above step may be redundant.
# -- filter na's, because when you clip a raster to a geometry, the pixels outside of the geometry are still there but they have values of NA.  This step is the most memory intensive step in the whole process.
# -- save the RDS to be modeled in random forests. There is definitely a better way to do this.....
# -- rm data_to_be_modeled otherwize each iteration will fail on the remove NA step.


subset_training_data_from_tile<- function( tile_name, folder_of_tiles, file_path_to_shape){


  ## read raster make ndvi layer and add it to the brick.
  raster<-brick(paste0(paste(folder_of_tiles, tile_name ,sep="/"), ".tif" ))
  names(raster)<-c("b1", "b2", "b3", "b4") ## Rename Bands for ease of use
  ndvi<-overlay(raster$b4, raster$b3, fun=function(x,y){(x-y)/(x+y)})
  cov<-addLayer(raster,ndvi) ## Merge NDVI and the tile imagery
  names(cov)<-c("b1", "b2", "b3", "b4", "ndvi")

  ## parse and read shapefile
  temp<-stringr::str_split(file_path_to_shape, "/")
  temp2<-readOGR(dsn=paste(head(temp[[1]], -1) , collapse = "/"), layer=paste(tail(temp[[1]], 1))) ## Don't remember what this does?
  temp2@data$code<-as.numeric(temp2@data$Class)
  shape<-crop(temp2, extent(cov))%>%
    rasterize(ndvi, field="code")  
  names(shape)<-"class"

  rm(ndvi, temp, temp2, raster)

  data_to_be_modeled<-crop(cov, extent(shape))%>%
    mask(shape)%>%
    addLayer(shape)%>%
    getValues()%>%
    as.data.frame()%>%
    filter(!is.na(class))

  saveRDS(data_to_be_modeled, paste0("training_datasets/", tile_name, "training_data.rds"))

  rm(data_to_be_modeled)
}


## Run random forest on combined training dataset
# - reads the folder with tiles
# -- takes all file names and stores them in a list to be transfered to the `subset_training_data_from_tile` function which
# - reads the shapefile
# -- adds the shapefile to `subset_training_data_from_tile`
# - tile names are looped over and sent to `subset_training_data_from_tile` individually with the shapefile.
# - all individually returned tile training datasets are combined together with rbind.fill
# - combined dataset, is run through random forests.
build_model<-function(folder_of_tiles, file_path_to_shape){
  t<-base::list.files(folder_of_tiles)%>%
    tools::file_path_sans_ext()%>%
    tools::file_path_sans_ext()%>%
    base::unique() ## May want to change this to just a vector and use this for just apply

  t2<-folder_of_tiles
  t3<-file_path_to_shape

  lapply(t, subset_training_data_from_tile, t2, t3)

  t4<-base::list.files("training_datasets")

  t5<-lapply(t4, function(x)readRDS(paste0("training_datasets/", x)))
  t6 <- do.call(plyr::rbind.fill, t5)

  head(t6)

  rm(t5)

  fit<-randomForest(as.factor(class)~.,
                    data=t6,
                    importance=TRUE,
                    ntree=500, norm.votes = FALSE
  )
  rm(t6)
  return(fit)
}


## Run the function `build_model`
set.seed(420)
start_time <- Sys.time()

test_model<-build_model("test_tiles", "test_shape/training_polygons12N_12102018")

end_time <- Sys.time()

end_time - start_time
 ```
