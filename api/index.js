const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

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
    const plantsRes = coll.find({ type: type });

    for await (const doc of plantsRes) {
      plants.push(doc);
    }

    res.send({ plants });
  }
});

//handle add plant
app.post("/plants/add", async (req, res) => {
  try {
    //validate if body contains name, scientific name and image URL
    const { name, scientificName, imageUrl } = req.body;

    //return early if body not provided
    if (!name || !scientificName || !imageUrl) {
      return res.status(400).send("Name, scientific name and image URL required");
    }

    const coll = dbClient.db("SoilSentry").collection("Plants");
    const doc = {
      name,
      scientificName,
      imageUrl,
    };

    const dbRes = await coll.insertOne(doc);
    console.log(dbRes);

    return res.send("Plant added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding plant");
  }
});

//create a update method that just upserts the name
app.put("/plants/update/:id/:name", async (req, res) => {
  try {
    //validate if body contains plant ID and name
    const id = req.params.id
    const name = req.params.name

    //return early if body not provided
    if (!id || !name) {
      return res.status(400).send("ID and name required");
    }

    const coll = dbClient.db("SoilSentry").collection("Plants");
    const doc = {
      name,
    };

    console.log({id})

    const dbRes = await coll.updateOne({ _id: new ObjectId(id) }, { $set: doc });
    console.log(dbRes);

    return res.send("Plant updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating plant");
  }
});

//handle login
app.post("/login", async (req, res) => {
  //extract email and pass, return early if either is missging
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }

  const userCollection = dbClient.db("SoilSentry").collection("Users");
  const user = await userCollection.findOne({ email: email });

  //compare password hashes
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid login credentials");
  }

  return res.status(200).send({ id: user._id, email: user.email });
});

//create a delete hander that extracts :id from the path 
app.delete("/plants/delete/:id", async (req, res) => {
  try {
    //validate if body contains plant ID
    const id = req.params.id;

    //return early if body not provided
    if (!id) {
      return res.status(400).send("ID required");
    }

    const coll = dbClient.db("SoilSentry").collection("Plants");

    const dbRes = await coll.deleteOne({ _id: new ObjectId(id) });
    console.log(dbRes);

    return res.send("Plant deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting plant");
  }
});

//Track telementry data
app.post("/track", async (req, res) => {
  try {
    //validate if body contains project ID and data type (soil moisture, temperature, humidity)
    const data = await req.body;
    console.log(data);

    //return early if body not provided
    if (!data) {
      return res.status(400).send("Body required");
    }

    //return early if body doesnt contain project ID and data type
    if (!data.user_id || !data.data) {
      return res.status(400).send("User ID and data required");
    }

    //return early if data doesnt contain type, value or unit
    if (!data.data.type || !data.data.value || !data.data.unit) {
      return res.status(400).send("Data type, value and unit required");
    }

    const coll = dbClient.db("SoilSentry").collection("Telemetry");
    const doc = {
      user_id: new ObjectId(data.user_id),
      date: new Date().toISOString(),
      data: {
        type: data.data.type,
        value: data.data.value,
        unit: data.data.unit,
      },
    };

    const dbRes = await coll.insertOne(doc);
    console.log(dbRes);

    return res.send("Tracked Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error tracking data");
  }
});
