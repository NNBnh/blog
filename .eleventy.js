const yaml = require('js-yaml');
const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');


module.exports = eleventyConfig => {
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

  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
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
  eleventyConfig.addCollection('tags', collection => {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return filterTags([...tagSet]);
  });

  eleventyConfig.addShortcode('img', (url, size = 1280) => {
    let imageUrl = new URL(url);
    if(imageUrl.host === 'images.unsplash.com') {
      if(!imageUrl.searchParams.has('w')) imageUrl.searchParams.set('w', size);
    }
    return imageUrl.toString();
  });

  eleventyConfig.addFilter('lang_url', (url) => {
    const currentLang = url.startsWith('/vi') ? 'vi' : 'en';
    return url.replace(
      new RegExp(`^/${currentLang}`),
      `/${currentLang === 'vi' ? 'en' : 'vi'}`
    );
  });

  eleventyConfig.addFilter('lang_string', (object, lang) => {
    if(typeof object === 'object') {
      return object[lang];
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