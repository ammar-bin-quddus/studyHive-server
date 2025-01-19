require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("studyHive server running");
});

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6oz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const assignmentsCollection = client
      .db("assignmentsDB")
      .collection("assignments");

    const submittedAssignmentCollection = client
      .db("assignmentsDB")
      .collection("submittedAssignments");

    const checkedAssignmentCollection = client
      .db("assignmentsDB")
      .collection("checkedAssignments");

    app.get("/allAssignments", async (req, res) => {
      const cursor = assignmentsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

    app.get("/allAssignments/pendingTasks", async (req, res) => {
      const cursor = submittedAssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get("/allAssignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

    app.post("/allAssignments/pendingTasks/marks", async(req, res) => {
      const checkedAssignmentData = req.body;
      const result = await checkedAssignmentCollection.insertOne(checkedAssignmentData);
      res.send(result);
    });

    app.post("/allAssignments", async (req, res) => {
      const newAssignments = req.body;
      //console.log(newAssignments);
      const result = await assignmentsCollection.insertOne(newAssignments);
      res.send(result);
    });

    app.post("/allAssignments/pendingTasks", async (req, res) => {
      const submitData = req.body;
      const result = await submittedAssignmentCollection.insertOne(submitData);
      res.send(result);
    });

    

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssignment = req.body;

      const updatedData = {
        $set: {
          photoUrl: updateAssignment.photoUrl,
          title: updateAssignment.title,
          description: updateAssignment.description,
          marks: updateAssignment.marks,
          dueDate: updateAssignment.dueDate,
          level: updateAssignment.level,
        },
      };

      const result = await assignmentsCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    app.delete("/allAssignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`server running on port: ${port}`);
});
