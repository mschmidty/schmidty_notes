const excerpt = require("eleventy-plugin-excerpt");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  //Plugins
  //Excerpts
  eleventyConfig.addPlugin(excerpt);
  //add Syntax highlight plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  //add Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  //RSS
  eleventyConfig.addPlugin(pluginRss);

  // eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
  //   if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
  //     return false;
  //   }
  // });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  //NEED TO MAKE A LARGE IMAGE POST template this is temporary to get things up and running.
  eleventyConfig.addLayoutAlias("large_image_post", "layouts/post.njk");

  // Allow data deep merge - meaning merge in posts.json to each post.
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setServerOptions({
    watch: ["_site/**/*.css"],
  });

  //passthroughs
  eleventyConfig.addPassthroughCopy("svg");
  eleventyConfig.addPassthroughCopy({ "src/assets": "img" });
  eleventyConfig.addPassthroughCopy("content/blog/**/*.png");
  eleventyConfig.addPassthroughCopy("content/blog/**/*.jpg");
  eleventyConfig.addPassthroughCopy({ "src/data": "data" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });

  //Markdown Settings
  let markdownLibrary = markdownIt({
    linkify: true,
    html: true,
  }).use(implicitFigures, {
    link: true,
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  //Better Dates
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLLL dd, yyyy",
    );
  });
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  function sortPosts(posts) {
    const sortPosts = (posts || []).sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
    return sortPosts;
  }
  eleventyConfig.addFilter("sortPosts", sortPosts);

  //Get a list of Tags
  function filterTagList(tags) {
    const filteredTags = (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1,
    );
    return [...new Set(filteredTags)];
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  });

  // Get Similar Posts
  const getSimilarCategories = function (categoriesA, categoriesB) {
    return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
  };

  eleventyConfig.addFilter("similarPosts", (collection, tags, path) => {
    const newTags = filterTagList(tags);
    return collection
      .filter((post) => {
        return (
          getSimilarCategories(post.data.tags, newTags) >= 1 &&
          post.data.page.inputPath !== path
        );
      })
      .sort((a, b) => {
        return (
          getSimilarCategories(b.data.tags, newTags) -
          getSimilarCategories(a.data.tags, newTags)
        );
      });
  });

  // Use excerpt Separator
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",
    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",
  };
};
