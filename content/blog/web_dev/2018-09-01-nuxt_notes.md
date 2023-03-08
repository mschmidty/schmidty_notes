---
layout: post
title:  "Notes on Nuxt"
date: 2018-09-01
tags: [js, Nuxt, Vue]
---
My notes on Nuxt.js.

## Middleware
Areas where you put functions that are pre-rendered.

## Getting to a new route very basic
To make a new route in Nuxt, you just create a new folder in the `pages` directory with an `index.vue` file in it. In that file you add a `template` something like this:

```html
<template>
  <div>
    <h1>Hello from Results</h1>
  </div>
</template>
```

Then, let's say on hitting enter on a form you want to go to that page we just created. You can add something like this:

```html
<template>
  <div class="">
    <h1>Search Itunes</h1>
    <br>
    <form class="" v-on:submit.prevent="submit" method="post">
      <input placehoder="Enter Artist Name"  autofocus>

    </form>
  </div>
</template>

<script>

export default {
  methods:{
    submit(event){
      this.$router.push('new_page_name');
    }
  }
}
</script>
```

### creating a new page and passing data to it
You do the exact same thing as above except instead of an `index.vue` file, you create a `_file.vue`.  This tells nuxt that you want to pass some information to the file upon hitting return.  The file that you want to go to the new page you created will look something like this:

```html
<template>
  <div class="">
    <h1>Search Itunes</h1>
    <br>
    <form class="" v-on:submit.prevent="submit" method="post">
      <input placehoder="Enter Artist Name" v-model="search" autofocus>

    </form>
  </div>
</template>

<script>

export default {
  components: {

  },
  data(){
    return{
      search:' '
    }
  },
  methods:{
    submit(event){
      this.$router.push(`results/${this.search}`);
    }
  }
}
</script>
```
