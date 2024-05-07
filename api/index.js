const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
//deploy react app
app.use(express.static(path.join(__dirname, "../web/build")));
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

//handle login
app.post("/login", async (req, res) => {
  const reqBody = req.body;

  console.log({ reqBody });
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

  return res.status(200).send({ id: user._id, email: user.email, isAdmin: user.isAdmin });
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
    if (!data.user_id || !data.data || !data.plant_id) {
      return res.status(400).send("User ID and data and plant_id is required");
    }

    //return early if data doesnt contain type, value or unit
    if (!data.data.type || !data.data.value || !data.data.unit) {
      return res.status(400).send("Data type, value and unit required");
    }

    const coll = dbClient.db("SoilSentry").collection("Telemetry");
    const doc = {
      user_id: new ObjectId(data.user_id),
      date: new Date().toISOString(),
      plant_id: new ObjectId(data.plant_id),
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

//here get the plants in the users db and plants collection, and filter the plants by userid in the request path
app.get("/user/:id/plants", async (req, res) => {
  const userId = new ObjectId(req.params.id);
  console.log("Fetching users plants for ..." + userId);
  const coll = dbClient.db("Users").collection("Plants");
  const plants = await coll.find({ user_id: userId }).toArray();
  //console.log(plants);
  res.send({ plants });
});

app.get("/plant/:id/telemetry", async (req, res) => {
  const plantId = new ObjectId(req.params.id);
  console.log("Fetching telemetry data for plant ..." + plantId);
  const coll = dbClient.db("SoilSentry").collection("Telemetry");

  const telemetryData = await coll
    .aggregate([
      { $match: { plant_id: plantId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
            hour: { $hour: "$date" },
            type: "$data.type",
          },
          averageValue: { $avg: "$data.value" },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
          "_id.day": -1,
          "_id.hour": -1,
        },
      },
      { $limit: 20 },
      { $project: { _id: 0, averageValue: 1, date: "$_id" } },
    ])
    .toArray();

  //console.log(telemetryData);
  res.send({ telemetryData });
});

//fetch plant data from SoilSentry.Plants with the passed in ID in get req and add it to Users.Plants
app.put("/user/:id/plants/add/:plant_id", async (req, res) => {
  const plantId = new ObjectId(req.params.plant_id);
  const userId = new ObjectId(req.params.id);
  console.log("Adding plant ..." + plantId + " to user ..." + userId);

  //fetch plant details
  const plantDeets = dbClient.db("SoilSentry").collection("Plants").findOne({
    _id: plantId,
  });

  const { _id, ...plantDetailsWithoutId } = await plantDeets;

  const coll = dbClient.db("Users").collection("Plants");
  const doc = {
    user_id: userId,
    ...plantDetailsWithoutId,
  };

  const dbRes = await coll.insertOne(doc);
  console.log(dbRes);

  return res.send("Added plant to user");
});

//post handler that updates the plant document, get id from the body
app.post("/plants/update", async (req, res) => {
  const plant = req.body;
  console.log("Updating plant...", plant);
  const coll = dbClient.db("SoilSentry").collection("Plants");
  const updateObject = { ...plant };
  delete updateObject._id;

  const dbRes = await coll.updateOne(
    { _id: new ObjectId(plant._id) },
    { $set: updateObject }
  );
  console.log(dbRes);
  res.send("Updated plant");
});

//delete handler to delete with ID
app.delete("/plants/:id", async (req, res) => {
  const plantId = new ObjectId(req.params.id);
  console.log("Deleting plant..." + plantId);
  const coll = dbClient.db("SoilSentry").collection("Plants");
  const dbRes = await coll.deleteOne({ _id: plantId });
  console.log(dbRes);
  res.send("Deleted plant");
});

//post /plants/add which adds a new plant
app.post("/plants/add", async (req, res) => {
  const plant = req.body;
  console.log("Adding plant...", plant);
  const coll = dbClient.db("SoilSentry").collection("Plants");
  const dbRes = await coll.insertOne(plant);
  console.log(dbRes);
  res.send({ ...plant, _id: dbRes.insertedId });
});

//serve react app
app.get("*", (req, res) => {
  res.sendFile(__dirname + "../web/build/index.html");
});
