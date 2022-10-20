const cheerio = require("cheerio");
const rp = require("request-promise");
const express=require("express")
const app=express();
const { Parser } = require("json2csv");
const fs = require("fs");

const reqLink = `https://www.quill.com/hanging-file-folders/cbk/122567.html`;

rp(reqLink)
  .then((html) => {
    const $ = cheerio.load(html);

    const title = $("div.SearchResultsNew> div> div> div> h3> a");

    const price = $(
      "div.SearchResultsNew> div> div > div> div > div> strong > span"
    );
    const description = $(".skuBrowseBullets");
    const modelNumber = $(".model-number");
    const itemNumber = $(".iNumber");
    const category = $("h1.current");

    let array = [];

    for (let i = 0; i < 10; i++) {
      // console.log(modelNumber[i].children[0].data);
      // console.log(itemNumber[i].attribs.content);
      // console.log(title[i].attribs.title);
      //console.log(price[i].children[0].data)
      //console.log(category[0].children[0].data)
      let newarray = [];
      for (let j = 0; j < description[i].children.length; j++) {
        newarray.push(description[i].children[j].attribs.title);
      }

      let object = {
        "Model Number": modelNumber[i].children[0].data,
        "Item Number": itemNumber[i].attribs.content,
        "Product Name": title[i].attribs.title,
        "Product Price": price[i].children[0].data,
        "Product Category": category[0].children[0].data,
        "Product Description": newarray,
      };
      array.push(object);
    }
    //console.log(array);
    const json2csvParser = new Parser();
    const data = json2csvParser.parse(array);
    fs.writeFile("webScrappingData", data, (err) => {
      if (err) throw err;
      console.log("Successfully File Saved");
    });

    //console.log(data)
    // app.get('/get-csv',((req,res)=>{

    // }))
    // app.listen(3001,(()=>{
    //     console.log('running')
    // }))
  })
  .catch((err) => {
    console.log(err);
  });
