---
layout: post
title:  "Vue and Axios"
date: 2018-09-02
tags: [js, axios, Vue]
---

My notes on getting up and running with vue and axios.  this is also the first step in turning my River Flow app which queries the USGS instantaneous flow data from a non server rendering non-route serving app to a Nuxt.js Universal Application (meaning it is rendered on the server before it is served).

## Objective
Make a call to the USGS API, and display the data in a usable format.

The biggest problem that we are going to face is, the API that we are making a request to is formatted in xml but we want our data in JSON so that it can be used in our application.

We will use Vue and Axios.

## What are we working with?
### What is vue?
From [vue's](https://vuejs.org/v2/guide/) website:
> Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.

I don't know what that means, soo...... It's kind fo like jQuery or React.

### What is Axios?
From [Axios's](https://github.com/axios/axios) Github page:
> Promise based HTTP client for the browser and node.js

Basically it allows you to make API requests from the browser of a node application.  But what is a `promise`?
> A promise represents the eventual result of an asynchronous operation. It is a placeholder into which the successful result value or reason for failure will materialize.
[source](https://spring.io/understanding/javascript-promises)

Now that we know what we are working with let
## Create Project with vue-cli
If you need the vue-cli you can find instructions for installing it [here](https://cli.vuejs.org/). Of course you will also need node.

```bash
vue create app-name
```
Then:
```bash
cd app-name
npm run serve
```
Boom you are up and running.

## Install Axios
But before we do anything else we need to also install axios.
```bash
^c ##control+c on a mac, to quit npm run serve
npm install axios --save ## install axios into our application
```
Axios is installed as a node dependency.

## Get rid of the fluff
Go to you `App.vue` file, found in your `src` folder and delete everything so that it looks like this:
```html
<template>
  <div id="app">

  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
/* You can keep the styling if you want*/
</style>

```

## The Steps
We will be doing the following in this app:
1. Create a button that when clicked will
2. Initiate a function that
3. Makes a request to the USGS instantaneous flow data database
4. We are going to parse that data converting from xml to json
5. Display that data.

## Creating a Button:HTML/vue template
The first thing we need to do is create a `button` html element with vue attributes (vue attributes look like this: `v-on:click`, or `v-if`). When thge button is clicked we want a js/vue function called `queryFlowData` to be called. We are going to:
1. Make a button with a `v-on:click="queryFlowData"` attribute so that when the attribute is clicked the `queryFlowData` function is called.
2. Make a space to return that data.

So just looking at the `<template>` tag from our `App.vue`, our file should look something like this:

```html
<template>
  <div id="app">
    <main>
      <h2>Click This Button to Query the API</h2>
      <button v-on:click="queryFlowData">FlowData</button>
      <div class="wrapper">
        {{flowData}}
      </div>
    </main>
  </div>
</template>
```
Ignore the `{{ flowData }}` inside `.wrapper` for a minute.  This will ultimately be where we render our data.

Your app should look like this when you are done:
![Screen Shot of vue app](/img/web_dev/vue_axios_notes_screen_shot_start.png)

## The JS/vue

Now we need write a function, `queryFlowData` that will make a call using axios to get data from the USGS.  Between our `<scrip>` element enter the following:

```html
<script>
import axios from 'axios';
export default {
  name: 'app',
  data(){
    return {
      flowData: null
    }
  },
  methods: {
    queryFlowData: function () {
      axios
        .get("https://waterservices.usgs.gov/nwis/iv/?format=waterml,2.0&sites=09166500&parameterCd=00060,00065&siteStatus=all")
        .then(response=>(this.flowData = response))
        .catch(error=>(this.flowData = 'There was an Error' + error))
    }
  }
}
</script>
```
What did we enter here:
1. we imported `axios` so we could use it with: `import axios from 'axios;'`.
2. then we declared our `{{flowData}}` variable as a vue `data()` object.
3. then we added a `method:` object with our `queryFlowData` function.
4. the function uses `axios.get` to make a call to the usgs database to get the data from their API.
5. the data is returned and handled either with `then()` if it was successful or `catch()` if it is not succesfful.
6. in the `then()` function we make `flowData` equal to the axios response which it turns into json, with all of the flow data in `data`.

That was a lot that just happened there.

## XML to json conversion
With all of that done and the data returned we need to parse the xml and convert it to json so that we can use the resulting data in the browser.

### Download the xml2json
In your console we are going to add a package that will help us called `xml2js` that will handle the parsing for us.

```bash
npm install xml2js --save
```
Unfortunately the xml converted to json comes in a mess and parsing it took me a while. I want the current flow and the location of the flow gauge. So to get the instantaneous flow data for the Dolores River at Dolores you change your method to this:
```html
<script>
import axios from 'axios';

export default {
  name: 'app',
  data(){
    return {
      flowDataFlow: '', //Changed the name to flowDataFlow
      flowDataName:'' //Added flowDataName as a data object
    }
  },
  methods: {
    queryFlowData: function () {
      //Add the xml2js
      var parseString = require('xml2js').parseString;

      //Make the axios call to the API
      axios
        .get("https://waterservices.usgs.gov/nwis/iv/?format=waterml,2.0&sites=09166500&parameterCd=00060,00065&siteStatus=all")
        .then(response=>{
          //because of a scop issue inside of parseString you have to assign `this` a variable outside of the function
          var self = this;

          //Parse the xml that is response
          parseString(response.data, {preserveChildrenOrder:true},
            function(err, result){

            //Parse the Json for the right values that we need
            self.flowDataFlow= result['wml2:Collection']["wml2:observationMember"][0]["om:OM_Observation"][0]["om:result"][0]["wml2:MeasurementTimeseries"][0]["wml2:point"][0]["wml2:MeasurementTVP"][0]["wml2:value"][0]
            self.flowDataName = result['wml2:Collection']["wml2:observationMember"][0]["om:OM_Observation"][0]["om:featureOfInterest"][0].$["xlink:title"]
          })
        })
        .catch(error=>(this.flowData = 'There was an Error' + error))
    }
  }
}
</script>
```
