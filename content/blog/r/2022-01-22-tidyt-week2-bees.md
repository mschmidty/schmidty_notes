---
layout: post
title: "Tidy Tuesday: Week 2 Bees"
date: 2022-01-22
tags: [ tidytuesday ]
---

A post about bee colonies. I wanted make a plot for each state and have each plot be plotted to the x y location of that state on a map.  I used the package [`geo_facet`](https://cran.r-project.org/web/packages/geofacet/vignettes/geofacet.html). 

## Final Plot

![Percent of bee colonies lost per quarter by state in the united ](/img/r/2022/tt_w2_bees_plot.jpg)

## Scripts
```r
library(tidyverse)
library(geofacet)
library(extrafont)
loadfonts()

tuesdata <- tidytuesdayR::tt_load('2022-01-11')

colony <- tuesdata$colony

theme_set(theme_minimal(
  base_family = "Fira Code",
  base_size = 8
))


theme_update(
  plot.margin = margin(30,30,30,30,unit = "pt"),
  plot.title = element_text(family = "Fira Code SemiBold", size=15),
  plot.subtitle = element_text(color = "#666666"),
  plot.background = element_rect(fill="#efefef", color = "transparent"),
  panel.background = element_rect(fill="#efefef", color = "#333333"),
  panel.grid.minor = element_blank(),
  panel.grid.major = element_blank(),
  strip.text = element_text(family="Fira Code SemiBold")
)

colony%>%
  mutate(
    month_order=case_when(
      months=="January-March" ~ "01",
      months=="April-June" ~ "04",
      months == "July-September" ~ "07", 
      months == "October-December" ~ "10"
    ),
    date = as.Date(paste0(year, "-" ,  month_order, "-","01"), "%Y-%m-%d"),
    colony_lost_pct = ifelse(is.na(colony_lost_pct), 0, colony_lost_pct)
  )%>%
  ggplot(aes(date, colony_lost_pct, fill=colony_lost_pct))+
  geom_col(width = 90)+
  scale_y_continuous(labels = scales::percent_format(scale = 1), breaks = scales::pretty_breaks(n = 3))+
  labs(
    title = "Percent (%) of Bee Colonies Lost per Quarter",
    subtitle = "2015 to 2021: Per State in the United States.",
    x = "",
    y = "",
    caption = "Data: USDA | Plot By: Mike Schmidt"
  )+
  scale_fill_gradient(low = "#222222", high = "#222222")+
  theme(
    legend.position = "none",
    plot.title = element_text(hjust = 0.5),
    plot.subtitle = element_text(hjust = 0.5, margin = margin(0,0,30,0,unit="pt")),
    axis.text = element_text(size=8),
    axis.text.x = element_blank(),
    plot.background=element_rect(fill=base_color),
    panel.background=element_rect(fill=base_color)
  )+
  facet_geo(~state)+
  ggsave(here::here("2022", "02-bees", "yellow_plot.jpg"), dpi = "retina", width=13.3*0.7, height=9.19*0.7)
```
