---
layout: post
title: "Cumulative Distribution Function"
date: 2019-04-11
tags: [ R ]
published: true
---

Cumulative distribution functions allow you to answer the questions, what percent of my sample is less than or greater than a value. For example I work with sage-brush cover frequently.  With a cumulative distribution function I can answer the question, what proportion of my plots with sagebrush have greater than 90% cover.

Example of how this is done.

```r
library(dplyr)
rnorm(100, mean=0.20, sd=.07)%>%
  ecdf()%>%
  plot()
```

![Distance to Polygon example.](/img/r/assets/plots/cumulative_distribution_function_plot_ex.jpeg)

The x-axis shows the percent.  The y-axis shows the proportion of observations.
