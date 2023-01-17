const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const yaml = require("js-yaml");
const { DateTime } = require('luxon');
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = eleventyConfig => {
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  eleventyConfig.addPlugin(pluginTOC, { ul: true });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addCollection('currentYear', () => {
    return new Date().getFullYear();
  });

  function filterTags(tags) {
    return (tags || []).filter(tag => ["all", 'nav', 'post', 'posts'].indexOf(tag) === -1);
  }
  eleventyConfig.addFilter("filterTags", filterTags)
  eleventyConfig.addCollection('tags', collection => {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return filterTags([...tagSet]);
  });

  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({ class: 'link-mono' }),
    slugify: eleventyConfig.getFilter('slugify')
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postcss([tailwindcss(require('./tailwind.config.js')), autoprefixer()])
      .process(cssCode)
      .then(
        r => done(null, r.css),
        e => done(e, null)
      );
  });
  eleventyConfig.addWatchTarget('./src/styles/**/*.css');

  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  return {
    pathPrefix: '/blog/',
    dir: {
      input: 'src',
      output: 'dist'
    },
  };
};