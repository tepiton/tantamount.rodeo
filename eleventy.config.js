import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownFootnote from "markdown-it-footnote"
import pluginMermaid from "@kevingimbel/eleventy-plugin-mermaid"
import jsdom from "jsdom";
const { JSDOM } = jsdom;

import pluginFilters from "./_config/filters.js";
import metadata from "./content/_data/metadata.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	eleventyConfig.setServerOptions({
		// Show local network IP addresses for device testing
		showAllHosts: true
	});




	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({ "./public/": "/" })
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl")
		.addPassthroughCopy("./js/"); // Add this line for JavaScript files

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");
	// Watch JS files
	eleventyConfig.addWatchTarget("js/**/*.js");
	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use eleventy:ignore to opt-out)
		// supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
	});

	// Bundle <script> content and adds a {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to the `js` bundle (use eleventy:ignore to opt-out)
		// supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(pluginMermaid, {
    // load mermaid from local assets directory
    mermaid_js_src: 'https://unpkg.com/mermaid@10/dist/mermaid.esm.min.mjs',
    html_tag: 'div',
    extra_classes: 'graph',
    mermaid_config: {
      'startOnLoad': true,
      'theme': 'dark'
    }
  });


	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: metadata.feed.path,
		stylesheet: "pretty-atom-feed.xsl",
// 	templateData: { // for when we add the feed to the index
//	  eleventyNavigation: {
//		  key: "Feed",
//		  order: 4
//    }
//  },
  collection: {
			name: "posts",
			limit: metadata.feed.limit,
		},
		metadata: {
			language: metadata.language,
			title: metadata.title,
			subtitle: metadata.feed.subtitle,
			base: metadata.url,
			author: metadata.author
		}
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats for each image.
		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				// e.g. <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			}
		},

		sharpOptions: {
			animated: true,
		},
	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

// Add a filter to separate footnotes from the main content
eleventyConfig.addFilter("separateFootnotes", function(content) {
    // Create a DOM from the HTML content
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Find the footnotes section
    const footnotesSection = document.querySelector('section.footnotes');
    let footnotesHtml = '';
    let footnoteData = {};

    // If footnotes exist, extract them and create inline data
    if (footnotesSection) {
      footnotesHtml = footnotesSection.outerHTML;
      
      // Extract individual footnotes for inline use
      const footnoteItems = footnotesSection.querySelectorAll('.footnote-item');
      footnoteItems.forEach(item => {
        const id = item.getAttribute('id');
        if (id) {
          // Extract just the text content, removing the back-reference link
          const backRef = item.querySelector('.footnote-backref');
          if (backRef) backRef.remove();
          footnoteData[id] = item.innerHTML.trim();
        }
      });
      
      // Simply add data attributes to footnote references for JavaScript enhancement
      const footnoteRefs = document.querySelectorAll('sup.footnote-ref a[href^="#fn"]');
      footnoteRefs.forEach(ref => {
        const href = ref.getAttribute('href');
        const fnId = href.substring(1); // Remove the #
        
        if (footnoteData[fnId]) {
          // Add data attributes that JavaScript can use
          ref.setAttribute('data-footnote-id', fnId);
          ref.setAttribute('data-footnote-content', footnoteData[fnId]);
          ref.classList.add('footnote-enhanced');
        }
      });
      
      footnotesSection.remove();
    }

    // Return enhanced content with inline footnote data
    return {
      content: dom.window.document.body.innerHTML,
      footnotes: footnotesHtml,
      footnoteData: footnoteData
    };
  });


	// Markdown specials
	eleventyConfig.amendLibrary("md",
		(md) => md.use(markdownFootnote)
							.set({ typographer: true,
								     breaks: false
							 })
	);

	eleventyConfig.amendLibrary("md",
		(md) => {
			md.renderer.rules.footnote_caption = (tokens, idx) => {
				let n = Number(tokens[idx].meta.id + 1).toString()

				if (tokens[idx].meta.subId > 0) {
					n += ':' + tokens[idx].meta.subId
				}
				return `(${n})`;
			}

			md.renderer.rules.footnote_block_open = (tokens, idx) => (
				`<div class="footnotes-sep"></div>
		<section class="footnotes">
		<ol class="footnotes-list">`
			)
		}
	)


};



export const config = {
	dataTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	markdownTemplateEngine: "njk",
	templateFormats: [
		"md",
		"njk",
		"html",
		"11ty.js",
	],

	// These are all optional:
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "_data",             // default: "_data" (`input` relative)
		output: "_site"
	}
};
