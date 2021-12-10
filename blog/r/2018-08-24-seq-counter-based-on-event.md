---
layout: post
title: "A Method for counting in a sequence, reset by a binary event in R"
date: 2018-08-24
tags: dplyr
---

A method for creating a variable that sequential counts until an binary event occurs in another vairiable.

## Load Libraries
```{r}
library(dplyr)
```

## Create an data set

The dataset consists of and id, an event that is 0 or 1 %20 of the time, and a panel of "a".  The panel was created because I could only find a solution that was grouped by a panel.  
```{r}
id<-1:30
df<-data.frame(id)
df

df1<-df%>%
  mutate(event = sample(1:10, size=30, replace=T))%>%
  mutate(event=if_else(event>8, 1, 0))%>%
  mutate(panel = "a")
df1
```

This code makes the counter which is reset everytime the event is 1.

```{r}
df1%>%
  group_by(panel, idx=cumsum(event==1L))%>%
  mutate(counter=row_number())%>%
  ungroup%>%
  select(-idx, -panel)
```
