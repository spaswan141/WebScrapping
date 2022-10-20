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

    //.................Fetching the data by selectors.................//
    const title = $("div.SearchResultsNew> div> div> div> h3> a");

    const price = $(
      "div.SearchResultsNew> div> div > div> div > div> strong > span"
    );
    const description = $(".skuBrowseBullets");
    const modelNumber = $(".model-number");
    const itemNumber = $(".iNumber");
    const category = $("h1.current");


  //........Push the data in array.......//  
    let data = [];

    for (let i = 0; i < 10; i++) {
      // console.log(modelNumber[i].children[0].data);
      // console.log(itemNumber[i].attribs.content);
      // console.log(title[i].attribs.title);
      //console.log(price[i].children[0].data)
      //console.log(category[0].children[0].data)
      
      let descriptionArray = [];
      for (let j = 0; j < description[i].children.length; j++) {
        descriptionArray.push(description[i].children[j].attribs.title);
      }

      let object = {
        "Model Number": modelNumber[i].children[0].data,
        "Item Number": itemNumber[i].attribs.content,
        "Product Name": title[i].attribs.title,
        "Product Price": price[i].children[0].data,
        "Product Category": category[0].children[0].data,
        "Product Description": descriptionArray,
      };
      data.push(object);
    }
    //console.log(array);



    //....................To Export Data to Csv File......................//
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(data);
    //console.log(csvData)
    fs.writeFile("webScrappingData.csv", csvData, (err) => {
      if (err) throw err;
      console.log("Successfully File Saved");
    });
    

    app.get('/',((req,res)=>{
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(data);
        res.attachment("webScrappingData.csv")
        res.status(200).send(csvData)
    }))
    const PORT = process.env.PORT || 8080;
    app.listen(PORT,(()=>{
        console.log(`server listening on http://localhost:${PORT}`)
    }))
  })
  .catch((err) => {
    console.log(err);
  });
