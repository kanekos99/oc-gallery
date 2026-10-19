const fs = require("fs");

module.exports = function () {
  const rawData = fs.readFileSync("./data_other.json", "utf8");
  const data = JSON.parse(rawData);
  const outputData = {};

  data.forEach((item) => {
    const tags = item.tags.split(",").map((tag) => tag.trim());

    tags.forEach((char) => {
      if (!outputData[char]) {
        outputData[char] = [];
      }

      const imageObject = {
        src: item.img,
        credit: item.credit,
        credit_link: item.credit_link,
        type: item.type,
      };

      const exists = outputData[char].some((entry) => entry.src === imageObject.src);
      if (!exists) {
        outputData[char].push(imageObject);
      }
    });
  });

  fs.writeFileSync(
    "./src/_data/gift_images.json",
    JSON.stringify(outputData, null, 4),
  );
};
