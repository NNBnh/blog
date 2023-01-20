const yaml = require('js-yaml');
const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));
  eleventyConfig.addPlugin(pluginTOC, { ul: true });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({ class: 'link-mono' }),
    slugify: eleventyConfig.getFilter('slugify')
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addNunjucksAsyncFilter('postcss', function(cssCode, done) {
    postcss([tailwindcss(require('./tailwind.config.js')), autoprefixer()])
      .process(cssCode)
      .then(
        r => done(null, r.css),
        e => done(e, null)
      );
  });
  eleventyConfig.addWatchTarget('./src/styles/**/*.css');

  function filterTags(tags) {
    return (tags || []).filter(tag => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1);
  }
  eleventyConfig.addFilter('filter_tags', filterTags);
  eleventyConfig.addCollection('tags', function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return filterTags([...tagSet]);
  });

  eleventyConfig.addShortcode('img', function(url, size = 1280) {
    let imageUrl = new URL(url);
    if(imageUrl.host === 'images.unsplash.com') {
      if(!imageUrl.searchParams.has('w')) imageUrl.searchParams.set('w', size);
    }
    return imageUrl.toString();
  });

  // #TODO Improve
  function getUrlLang(url) {
    return (url.match(/^\/(en|vi)\//) || [null, 'en'])[1];
  }
  eleventyConfig.addFilter('to_lang', function(url, language = null) {
    return url.replace(
      /^\/(en\/|vi\/|)/,
      `/${language || getUrlLang(this.page.url)}/`
    );
  });
  eleventyConfig.addFilter('lang_string', function(object) {
    if(object !== null && typeof object === 'object') {
      return object[getUrlLang(this.page.url)];
    } else {
      return object;
    }
  });

  return {
    pathPrefix: '/blog/',
    dir: {
      input: 'src',
      output: 'dist'
    },
  };
};