const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary(
    'md',
    markdownIt().use(markdownItAnchor)
  )

  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postcss([tailwindcss(require('./tailwind.config.js')), autoprefixer()])
      .process(cssCode)
      .then(
        (r) => done(null, r.css),
        (e) => done(e, null)
      );
  });
  eleventyConfig.addWatchTarget('styles/**/*.css');

  eleventyConfig.addPlugin(pluginTOC)
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  return {
    pathPrefix: '/blog/',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
