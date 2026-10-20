const markdownIt = require("markdown-it");
const gallerySort = require("./scripts/gallery-sort");
const giftSort = require("./scripts/gift-sort");
const md = new markdownIt({ html: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/images");
  eleventyConfig.addPassthroughCopy("./src/scripts");

  eleventyConfig.watchIgnores.add("./src/_data/sorted_images.json");
  eleventyConfig.watchIgnores.add("./src/_data/gift_images.json");
  eleventyConfig.on("eleventy.before", async () => {
    gallerySort();
    giftSort();
  });

  eleventyConfig.addCollection("worlds", function (collectionApi) {
    const allWords = new Map();

    collectionApi.getAll().forEach((item) => {
      const parts = item.inputPath.split("/");
      const charIndex = parts.indexOf("characters");

      if (charIndex !== -1 && parts.length > charIndex + 2) {
        const subfolder = parts[charIndex + 1];

        const characterCollection = sortCollection(
          collectionApi.getFilteredByTag(subfolder),
        );

        if (!allWords.has(subfolder)) {
          allWords.set(subfolder, {
            name: subfolder,
            title: item.data.title,
            characters: characterCollection,
            about: item.data.about || { name: subfolder },
            theme: item.data.theme,
          });
        }
      }
    });

    const worldOrder = ["lunarverse", "mythic-realm"];

    const sortedWorlds = Array.from(allWords.values()).sort((a, b) => {
      let indexA = worldOrder.indexOf(a.name);
      let indexB = worldOrder.indexOf(b.name);

      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;

      return indexA - indexB;
    });

    return sortedWorlds;
  });

  function sortCollection(items) {
    const filteredItems = items.filter((item) => {
      const orderList = item.data.order || [];
      return orderList.includes(item.fileSlug);
    });
    return filteredItems.sort((a, b) => {
      const orderList = a.data.order || [];
      const indexA = orderList.indexOf(a.fileSlug);
      const indexB = orderList.indexOf(b.fileSlug);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return a.data.name.localeCompare(b.data.name);
    });
  }

  eleventyConfig.addFilter(
    "getAltsByTag",
    function (collection, currentUrl, id) {
      if (!id) return [];

      const filtered = collection.filter(
        (item) =>
          item.url !== currentUrl &&
          item.data.id &&
          item.data.id === id,
      );

      const original = filtered.find(
        (item) => !item.data.au
      );

      if (!original) return filtered;

      const alternates = filtered.filter((item) => item !== original);
      return [original, ...alternates];
    },
  );

  eleventyConfig.addFilter("getSection", function (content, sectionName) {
    const regex = new RegExp(
      `<!-- section: ${sectionName} -->([\\s\\S]*?)(?=<!-- section:|$|---)`,
    );
    const match = content.match(regex);
    if (match && match[1]) {
      return md.render(match[1].trim());
    }
    return "";
  });

  eleventyConfig.addFilter("getStorySubSections", function (content) {
    const mainRegex = new RegExp(
      `<!-- section: story -->([\\s\\S]*?)(?=<!-- section:|$|---)`,
    );
    const mainMatch = content.match(mainRegex);
    if (!mainMatch || !mainMatch[1]) return {};

    const mainContent = mainMatch[1];

    const subRegex =
      /<!-- sub-section:\s*(.*?) -->([\s\S]*?)(?=<!-- sub-section:|$)/g;
    let subSections = {};
    let match;

    while ((match = subRegex.exec(mainContent)) !== null) {
      let subName = match[1].trim();
      let subText = match[2].trim();
      subSections[subName] = md.render(subText);
    }

    return subSections;
  });

  eleventyConfig.addShortcode("charaProfileThumbnail", function (src) {
    const url = eleventyConfig.getFilter("url")(src);

    const prefix =
      process.env.NODE_ENV === "neocities"
        ? "https://kanekos99.github.io/"
        : "";

    const finalUrl = `${prefix}${url}`;

    return `
      <img
        src="${finalUrl}"
      />
    `;
  });

  return {
    dir: {
      input: "src",
      output: "public/oc-gallery",
    },
    pathPrefix: "/oc-gallery/",
  };
};
