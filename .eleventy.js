const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const { DateTime } = require('luxon');
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginTOC)
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden(),
    slugify: eleventyConfig.getFilter('slugify')
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postcss([tailwindcss(require('./tailwind.config.js')), autoprefixer()])
      .process(cssCode)
      .then(
        (r) => done(null, r.css),
        (e) => done(e, null)
      );
  });
  eleventyConfig.addWatchTarget('styles/**/*.css');

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
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
