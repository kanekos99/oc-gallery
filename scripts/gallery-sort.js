const fs = require("fs");

module.exports = function () {
  const rawData = fs.readFileSync("./data.json", "utf8");
  const data = JSON.parse(rawData);
  const characters = {};

  data.forEach((item) => {
    const imageUrl = item.image;
    const category = item.type === "ref" ? "ref" : "others";
    const tags = item.tags.split(",").map((tag) => tag.trim());

    tags.forEach((char) => {
      if (!characters[char]) characters[char] = { ref: [], others: [] };
      if (!characters[char][category].includes(imageUrl)) {
        characters[char][category].push(imageUrl);
      }
    });
  });

  const outputData = {};

  Object.keys(characters).forEach((char) => {
    const refList = characters[char].ref;
    const othersList = characters[char].others;

    outputData[char] = {
      count: refList.length + othersList.length,
      ref: refList,
      others: othersList,
    };
  });

  fs.writeFileSync(
    "./src/_data/sorted_images.json",
    JSON.stringify(outputData, null, 4),
  );
};
