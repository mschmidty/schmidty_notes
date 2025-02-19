---
layout: post
title: '30 Day Map Challenge (Points): AIM Total Foliar Cover'
date: 2024-11-26T00:00:00.000Z
tags:
  - AIM
  - 30DayMapChallenge
format:
  commonmark:
    variant: +yaml_metadata_block
    df-print: tibble
    dev: ragg_png
execute:
  echo: true
  message: false
  warning: false
  class-output: r
---


I’ve been a bit busy, so I’m just getting to my first map challenge of
the month lines. For it, I’m using my favorite dataset, the Bureau of
Land Management’s, Assessment, Inventory, and Monitoring dataset. Here
is total foliar cover for every point completed in the Western Lower 48
states. You can find the data set
[here](https://gbp-blm-egis.hub.arcgis.com/pages/aim).

``` r
library(arcgislayers)
library(ragg)
library(ggtext)
library(tidyverse)
library(sf)
library(rnaturalearth)
library(MetBrewer)

aim_data_all <- arc_open("https://services1.arcgis.com/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_Natl_AIM_TerrADat_Hub/FeatureServer/0")

conus <- ne_states(country = "united states of america") |>
  filter(region == "West") |>
  filter(name != "Alaska" & name != "Hawaii") |>
  st_transform(4269)

conus_aim_west <- arc_select(
  x = aim_data_all,
  filter_geom = st_bbox(conus)
)

conus_aim_west_clip <- st_intersection(conus_aim_west, conus) |>
  mutate(TotalFoliarCover = TotalFoliarCover / 100)

p <- ggplot() +
  geom_sf(data = conus, fill = "#333333", color = "transparent") +
  geom_sf(data = conus_aim_west_clip, aes(color = TotalFoliarCover), size = 2.5) +
  scale_color_gradientn(colors = met.brewer("Johnson"), labels = scales::label_percent()) +
  geom_sf(data = conus, fill = "transparent", color = "white", linewidth = 0.5) +
  theme_void(base_family = "FiraCode Nerd Font Mono") +
  labs(
    title = "Total Foliar Cover (%)",
    subtitle = "Asessment, Inventory, and Monitoring (AIM) dataset<br>from the Bureau of Land Management.",
    color = "",
    caption = "Mike Schmidt | schmidtynotes.com"
  ) +
  theme(
    legend.position = "top",
    plot.title = element_markdown(
      family = "Work Sans ExtraBold",
      size = 20,
      hjust = 0.5,
      margin = margin(0, 0, 15, 0, "pt")
    ),
    plot.subtitle = element_markdown(
      size = 10,
      hjust = 0.5,
      margin = margin(0, 0, 5, 0, "pt"),
      lineheight = 1.6,
      color = "grey50"
    ),
    plot.margin = margin(20, 20, 20, 20, "pt"),
    legend.margin = margin(7, 0, 0, 0, "pt"),
    legend.title = element_text(face = "bold", size = 7),
    legend.text = element_text(size = 7),
    legend.key.height = unit(5, "pt"),
    legend.key.width = unit(50, "pt"),
    legend.key.spacing.x = unit(20, "pt"),
    legend.title.position = "top"
  )

p
```

![](index_files/figure-commonmark/unnamed-chunk-1-1.png)
