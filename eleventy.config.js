import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import yaml from "js-yaml";
import pluginTOC from "eleventy-plugin-toc";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const langs = ["vi", "en"];

export default function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("./src/styles/index.css");
    const tailwindOutputPath = "./dist/styles/index.css";
    const cssContent = fs.readFileSync(tailwindInputPath, "utf8");
    const outputDir = path.dirname(tailwindOutputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([tailwindcss()]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPlugin(pluginTOC, { ul: true });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  let markdownLibrary = markdownIt({
    html: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      class: "link-mono",
      placement: "before",
    }),
    slugify: eleventyConfig.getFilter("slugify"),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addWatchTarget("./src/styles/**/*.css");

  function filterTags(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1,
    );
  }
  eleventyConfig.addFilter("filter_tags", filterTags);
  eleventyConfig.addCollection("tags", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTags([...tagSet]);
  });

  eleventyConfig.addShortcode("img", function (url, size = 1280) {
    let imageUrl = new URL(url);
    if (imageUrl.host === "images.unsplash.com") {
      if (!imageUrl.searchParams.has("w")) imageUrl.searchParams.set("w", size);
    }
    return imageUrl.toString();
  });

  function getUrlLang(url) {
    return (url.match(RegExp(`^/(${langs.join("|")})/`)) || [null, "en"])[1];
  }
  eleventyConfig.addFilter("to_lang", function (url, language = null) {
    return url.replace(
      /^\/(en\/|vi\/|)/,
      `/${language || getUrlLang(this.page.url)}/`,
    );
  });
  eleventyConfig.addFilter("lang_string", function (object) {
    if (object !== null && typeof object === "object") {
      return object[getUrlLang(this.page.url)];
    } else {
      return object;
    }
  });

  return {
    pathPrefix: "/blog/",
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
