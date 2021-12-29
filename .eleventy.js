const excerpt = require('eleventy-plugin-excerpt');
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {

//Plugins
  //Excerpts
  eleventyConfig.addPlugin(excerpt);
  //add Syntax highlight plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  //add Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  
  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  //NEED TO MAKE A LARGE IMAGE POST template this is temporary to get things up and running. 
  eleventyConfig.addLayoutAlias("large_image_post", "layouts/post.njk");

  // Allow data deep merge - meaning merge in posts.json to each post. 
  eleventyConfig.setDataDeepMerge(true);

 //passthroughs
  eleventyConfig.addPassthroughCopy("svg");
  //eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.addPassthroughCopy({ "src/assets": "img" });
  eleventyConfig.addPassthroughCopy({ "src/data": "data" });
  //eleventyConfig.addPassthroughCopy("**/*.png");
  eleventyConfig.addPassthroughCopy({"src/js": "js"})

  //Markdown Settings
  let markdownLibrary = markdownIt({
    linkify: true,
    html: true
  }).use(implicitFigures, {
    link: true,
  })
  eleventyConfig.setLibrary("md", markdownLibrary)
  
  //Better Dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL dd, yyyy");
  });
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  function sortPosts(posts){
    const sortPosts = (posts || []).sort((a,b)=>{
      return new Date(b.data.date) - new Date(a.data.date)
    })
    return sortPosts
  }
  eleventyConfig.addFilter("sortPosts", sortPosts)

  //Get a list of Tags
  function filterTagList(tags) {
    const filteredTags =  (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
    return [...new Set(filteredTags)]
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  });

  return{
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",
    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",
  }
  
};