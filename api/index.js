const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Mongo URI is missing");
}

const dbClient = new MongoClient(uri);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/plants", async (req, res) => {
  let plants = [];
  //print request query params
  console.log("processing request...", req.query);
  const type = req.query.type;
  console.log(type);
  // if request query params is empty then return all plants
  const coll = dbClient.db("SoilSentry").collection("Plants");

  if (!type) {
    const plantsRes = coll.find();

    for await (const doc of plantsRes) {
      plants.push(doc);
    }

    res.send({ plants });
  } else {
    const plantsRes = coll.find({type: type});

    for await (const doc of plantsRes) {
      plants.push(doc);
    }

    res.send({ plants });
  }
});
