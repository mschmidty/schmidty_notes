---
layout: post
title: "How to pass a column name as a function parameter to a dplyr function in R."
date: 2021-12-20
tags: [ R, dplyr ]
published: true
---

If you need to pass a column name as a function parameter to a dplyr function/verb such as `filter()` or `mutate()` do this: 

```r
library(dplyr)

## Make a dummy dataframe
country<-c("USA", "Mexico", "Canada", "USA", "Mexico", "Canada", "USA", "Mexico")
fruits<-c("apple", "banana", "apple", "banana", "orange", "orange", "apple", "banana")
weight<-c(10,20,4,20,11,15,25,23)

df<-data.frame(fruits, country, weight)

## Write function that filters a column name by value.
filter_fruit<-function(x, col_name=fruits, value="apple"){
  x%>%
    filter({{col_name}}==value)
}
```

And calling the function:

```r
r$> filter_fruit(df)
  fruits country weight
1  apple     USA     10
2  apple  Canada      4
3  apple     USA     25

r$> filter_fruit(df, col_name=country, value="USA")
  fruits country weight
1  apple     USA     10
2 banana     USA     20
3  apple     USA     25

r$> filter_fruit(df, col_name=weight, value=20)
  fruits country weight
1 banana  Mexico     20
2 banana     USA     20
```

The key is the  around the column name and not adding quotes around the function parameter defaults when writing the function. 

You can find more information in the [Tidyverse Documentation](https://dplyr.tidyverse.org/articles/programming.html#indirection-2).



