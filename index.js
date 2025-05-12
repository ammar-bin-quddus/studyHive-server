require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

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

    const userDataCollection = client.db("assignmentsDB").collection("userDb");

    // const checkedAssignmentCollection = client
    //   .db("assignmentsDB")
    //   .collection("checkedAssignments");

    const verifyToken = (req, res, next) => {
      // console.log("inside verify token", req.headers);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "forbidden access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: "forbidden access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    app.get("/allAssignments", async (req, res) => {
      const search = req.query.search || "";
      const level = req.query.level || "";

      const query = {};

      if (search) {
        query.title = { $regex: search, $options: "i" };
      }

      if (level) {
        query.level = level;
      }

      const result = await assignmentsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/update/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

    app.get("/allAssignments/pendingTasks", verifyToken, async (req, res) => {
      const cursor = submittedAssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allAssignments/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });

    app.get("/attempted-assignments", verifyToken, async (req, res) => {
      const { email } = req.query;
      const result = await submittedAssignmentCollection
        .find({ examineeEmail: email })
        .toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userData = req.body;
      const result = await userDataCollection.insertOne(userData);
      res.send(result);
    });

    app.get("/users", verifyToken, async (req, res) => {
      const result = await userDataCollection.find().toArray();
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

    app.put("/update/:id", verifyToken, async (req, res) => {
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

    app.patch(
      "/allAssignments/pendingTasks/marks/:id",
      verifyToken,
      async (req, res) => {
        const id = req.params.id;
        const updateData = req.body;
        const query = { _id: new ObjectId(id) };

        const result = await submittedAssignmentCollection.updateOne(query, {
          $set: updateData,
        });
        res.send(result);
      }
    );

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
