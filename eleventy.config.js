import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import { minify } from "html-minifier";

import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

import pluginDrafts from "./eleventy.config.drafts.js";
import pluginImages from "./eleventy.config.images.js";

export default function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./wwwroot/": "/",
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	eleventyConfig.addFilter("summerizePost", post => {
    // get content
		const splitted =  post.split('<!-- more -->');
    if(splitted.length > 1) {
      return splitted[0];
    }
    // return the first paragraph
    return post.split('\n')[0];
  });

  eleventyConfig.addFilter("nohtml", content => {
    // remove all html tags
    return content.replace(/(<([^>]+)>)/gi, "");

  });

	eleventyConfig.addFilter("getPermalinkForHomePage", pageNumber => {
    // get content
		return pageNumber === 0 ? '/' : '/page/' + (pageNumber + 1) + '/';
  });

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || [])
		.filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addTransform("htmlmin", function(content) {
		// Prior to Eleventy 2.0: use this.outputPath instead
		if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
		  
			let minified = minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true
		  });
		  return minified;
		}
		return content;
	  });

	// Customize Markdown library settings:
	// eleventyConfig.amendLibrary("md", mdLib => {
	// 	mdLib.use(markdownItAnchor, {
	// 		permalink: markdownItAnchor.permalink.ariaHidden({
	// 			placement: "after",
	// 			class: "header-anchor",
	// 			symbol: "#",
	// 			ariaHidden: false,
	// 		}),
	// 		level: [1,2,3,4],
	// 		slugify: eleventyConfig.getFilter("slugify")
	// 	});
	// });

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	eleventyConfig.setServerPassthroughCopyBehavior("content/content");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
			"jpg",
			"jpeg",
			"gif",
			"webp"
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: false,

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
