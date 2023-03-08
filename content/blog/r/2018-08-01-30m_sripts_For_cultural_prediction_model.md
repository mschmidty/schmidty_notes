---
layout: post
title:  "Cultural Model R Scripts"
date: 2018-08-01
tags: [ predictive models, randomForest]
---

The following are scripts that I used to make a cultural prediction model.  It uses topographic, hydrologic and biological GIS information to predict areas where arc sites likely occur on the landscape.

## Load Libraries

```r
library(tidyverse)
library(randomForest)
```
## Read Data
I made the dataset loaded here in another R file. The file loaded here was created using a 30m Digital Elevation Model.  The elevation model was used to calculate slope, aspect, flow direction, TPI, TRI, and roughness.  
```r
data<-readRDS("rData/master_datasets/master_07172018.rds")
data
```

## Remove NAs
It may be more appropriate to impute NAs vs remove them completely, but there are very few NAs only at the spacial edge of the model.
```r
data_cl<- data%>% filter(!is.na(Slope)| !is.na(Aspect))%>%
  filter(!is.na(TPI)| !is.na(TRI))##%>%
```


## Convert character to factors
Random Forests can't handle characters so here we convert the characters to factors.

```r
data_cl$BPS_NAME<-as.factor(data_cl$BPS_NAME)
data_cl$GROUPVEG<-as.factor(data_cl$GROUPVEG)
data_cl$GROUPNAME<-as.factor(data_cl$GROUPNAME)
```

## Separate the dataset into surveyed and non surveyed datasets
The surveyed sites sill be used to train the model because we know there outcome.  The non-surveyed sites will have the model be applied to them.
```r
surveyed<-filter(data_cl, Survey=="Yes")
noSurvey<-filter(data_cl, Survey=="No")
```

## Separate the surveyed dataset into has arch site vs does not have candy.
Arch sites are coded from 1 to 6
Here we are selecting prehistoric sites (1) and multi sites (2).
The sites removed are:
3 - Historic
4 - NA
5 - Proto
6 - Historic
```r
surveyed$prehistoric_test<- ifelse(surveyed$RES_TYPE_Raster == 1| surveyed$RES_TYPE_Raster == 2, 1,2)
surveyed$prehistoric_test[is.na(surveyed$prehistoric_test)]<-2
```

## Separate the dataset into train and test
Separate the dataset randomly into 70:30 split.  The resulting train dataset will be used to make the model and the resulting test dataset will be used to test the model.
```r
train<-sample_frac(surveyed, 0.7)
sid<-as.numeric(rownames(train))
test<-surveyed[-sid,]
filter(train, prehistoric_test==1)
train
```


## Determine the number of sites vs non-sites`
```r
table(test$prehistoric_test)
```

## Run Random Forests
The following runs the model and assigns the model to fit.
```r
set.seed(415)

ptm<- proc.time()

fit<-randomForest(as.factor(prehistoric_test)~ Flowdir +      BPS_NAME + DEM + Slope + Aspect + GROUPNAME + INTR_NEAR +      PRNL_NEAR + MuleDeer_M + Elk_Mirgat + BigHorn_Mi + Prong_Migr +      ElkWinConc + TRI + TPI + Roughness + ElkSumConc + TurkeyProd +      TurkWinCon + BHS_SumCon + BHS_Prod + BHS_WinCon,
                  data=train,
                  importance=TRUE,
                  sampsize=c(6287,6287), ##This, sampsize, is extremely important. Random forests performs poorly with uneven classes (ie class 1 has a count of 500 and class 2 has a cound of 10,000).  We need to even out the sample sizes in the model.  How this is by taking the value with the lowest count and setting the second value to same or different proportion, in this case we only have 1029 observations that have candy.  If you wanted an evenly weighted sample size/weight you would set the sampsize to `sampsize=c(1029,1029)`.  In this case we want to overpredict candy so we give it a greater weight than the non candy sites.
                  mtry=12,
                  ntree=750)
proc.time() - ptm
varImpPlot(fit)
print(fit)
importance(fit)
```


## Find the results
The following applies the model `fit` to the `test` data and then determines how well it predicted both the candy sites and the non-cany sites.
```r
Prediction<-predict(fit, test)
prediction_test<- transform(test, predict=Prediction)
##prediction_test
prediction_test<-prediction_test %>%
  mutate(success=if_else(prehistoric_test==predict, 1, 0))

probability <- predict(fit, test, type="prob")
prob1<- probability[,1]
prob2<- probability[,2]
prediction_test<- transform(prediction_test, prob1=prob1)
prediction_test<- transform(prediction_test, prob2=prob2)

arc_predict<-filter(prediction_test, prehistoric_test==1)
no_predict<-filter(prediction_test, prehistoric_test==2)
##head(prediction_test)
count_arc_predict<- table(test$prehistoric_test)
count_arc_predict

sum(arc_predict$success)/count_arc_predict[names(count_arc_predict)==1]*100
sum(no_predict$success)/count_arc_predict[names(count_arc_predict)==2]*100


##arc_predict
##no_predict_predict[names(count_arc_predict)==2]*100

sum(prediction_test$success)/10639*100
```


## Predict the whole field office.
```r
final_predict<-predict(fit, data_cl)
table(final_predict)
data_cl_prediction<-transform(data_cl, predict=final_predict)

final_probability<-predict(fit, data_cl, type="prob")
prob1<- final_probability[,1]
prob2<- final_probability[,2]

data_cl_prediction<- transform(data_cl_prediction, prob1=prob1)
data_cl_prediction<- transform(data_cl_prediction, prob2=prob2)
head(data_cl_prediction)
```

## Save points
Save variables x, y and probability.  The x and y coordinates will be converted into a raster in Arc Map.
```r
export_data_cl<- dplyr::select(data_cl_prediction, x, y, predict:prob2 )
write_csv(export_data_cl,"rData/predicted_pointsV2.csv")
```
