const fs = require("fs");

module.exports = function () {
  const rawData = fs.readFileSync("./data.json", "utf8");
  const data = JSON.parse(rawData);
  const characters = {};

  data.forEach((item) => {
    const imageUrl = item.image;
    let category = "others";
    if (item.type === "ref") {
      category = "ref";
    } else if (item.type === "old") {
      category = "old";
    }
    const tags = item.tags.split(",").map((tag) => tag.trim());

    tags.forEach((char) => {
      if (!characters[char])
        characters[char] = { ref: [], others: [], old: [] };
      if (!characters[char][category].includes(imageUrl)) {
        characters[char][category].push(imageUrl);
      }
    });
  });

  const outputData = {};

  Object.keys(characters).forEach((char) => {
    const refList = characters[char].ref;
    const othersList = characters[char].others;
    const oldList = characters[char].old;

    outputData[char] = {
      count: refList.length + othersList.length + oldList.length,
      ref: refList,
      others: othersList,
      old: oldList,
    };
  });

  fs.writeFileSync(
    "./src/_data/sorted_images.json",
    JSON.stringify(outputData, null, 4),
  );
};
