---
layout: post
title: "Predicting if the Dolores River Will Have a Raftable Release V2 - Summary"
date: 2023-02-02
tags: [ "Machine Learning" ]
---

This post includes just the running prediction of if the Dolores River will have a raftable release below McPhee Dam this winter.  This is a post with just the results from a much longer [post]("blog/r/2023-01-05-dolores-river-flow-predict") I put up a few days ago.  This prediction is an update to the model I made in the previous post.  The only thing I updated is I didn't know that you could run XGboost regression as count/Poisson, which looks to be much more accurate (which makes sense).  

Unfortunately the update doesn't look good. The previous model predicted up to 15 days of raftable releases. This predicts less than a day so far. At least it is above zero. 

In addition, the model was "productionized" (not a real word but I like it) using Github Actions and runs on Monday and Thursday at noon. You can find the scripts for the action [here](https://github.com/mschmidty/dolores_flow_predict).

<figure>
  <a href="https://raw.githubusercontent.com/mschmidty/dolores_flow_predict/master/output/current_prediction.jpg">
    <img src="https://raw.githubusercontent.com/mschmidty/dolores_flow_predict/master/output/current_prediction.jpg" alt="A prediction of if the Dolores River will run" style = "mix-blend-mode: multiply"/>
  </a>
</figure>