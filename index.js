const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const uri = process.env.MONGO_URI;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // await client.connect();
    const coffeeCollection = client
      .db("coffees")
      .collection("coffeeCollection");

    const userCollection = client.db('coffees').collection('userCollection')

    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(filter);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    app.post('/users',async (req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users',async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedCoffee = {
        $set: {
          coffee_name: coffee.coffee_name,
          coffee_chef: coffee.coffee_chef,
          coffee_supplier: coffee.coffee_supplier,
          coffee_taste: coffee.coffee_taste,
          coffee_category: coffee.coffee_category,
          coffee_details: coffee.coffee_details,
          coffee_photo: coffee.coffee_photo,
          coffee_price: coffee.coffee_price,
        },
      };
      const result = await coffeeCollection.updateOne(filter,updatedCoffee);
      res.send(result)
    });

    app.patch('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email: user?.email}
      const updatedUser = {
        $set:{
          lastLogin: user?.lastLogin
        }
      }
      const result = await userCollection.updateOne(filter,updatedUser);
      res.send(result)
    })

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
};

run().catch((error) => console.log);

app.get("/", (req, res) => {
  res.send("Server Running!");
});

app.listen(port, () => console.log("App running on port", port));
