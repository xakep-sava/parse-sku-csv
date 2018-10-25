const fs = require("fs");
const csv = require("csv-parser");

const fileName = "1.csv";
let countRow = 0;

if (!fs.existsSync("input")) {
  fs.mkdirSync("input");
}

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

const outputStream = fs.createWriteStream("output/" + fileName);

fs.createReadStream("input/" + fileName)
  .pipe(csv())
  .on("data", data => {
    countRow++;

    var keys = Object.keys(data);

    if (countRow === 1) {
      outputStream.write(keys.join(",") + ',SKU' + "\n");
    }

    let output = data.Name.replace("BLACK", "");
    output = new RegExp(/\s([A-Z0-9-]{5,})/g).exec(output);

    if (output && output.length) {
      output = output[0];
    } else {
      output = "";
    }

    outputStream.write(Object.values(data).join(',') + ',' + output.trim() + "\n");
  })
  .on("end", () => {
    console.log("Count row: " + countRow);
    console.log("Done...");

    outputStream.end();
  });
