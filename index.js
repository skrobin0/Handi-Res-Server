const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware----

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkvef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    //   console.log("con to db");
    const database = client.db("HandiShop");
    const foodCollection = database.collection("foods");
    const ordersCollection = client.db("HandiShop").collection("orders");

    // Get Foods Data
    app.get("/foods", async (req, res) => {
      const cursor = foodCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });

    //Post watches data
    app.post("/foods", async (req, res) => {
      const watch = req.body;
      console.log("hit post api", watch);
      const result = await foodCollection.insertOne(watch);
      console.log(result);
      res.json(result);
    });

    //place order
    app.post("/orders", async (req, res) => {
      console.log(req.body);
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });

    //My order
    app.get("/orders/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      // console.log(req.params.email);
    });

    //Delete My order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    //Get register order
    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Handi-Server running server");
});

app.listen(port, () => {
  console.log("Handi-Server running server port", port);
});
