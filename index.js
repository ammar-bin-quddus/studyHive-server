require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["https://studyhive-896d8.web.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const connectDB = require("./config/db");
const { init: initAssignments } = require("./models/assignmentModel");
const { init: initSubmissions } = require("./models/submissionModel");
const { init: initUsers } = require("./models/userModel");

const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.get("/", (req, res) => res.send("studyHive server running"));

(async () => {
  const client = await connectDB();
  const db = client.db("assignmentsDB");

  // init collections
  initAssignments(db);
  initSubmissions(db);
  initUsers(db);

  // routes
  app.use("/allAssignments", assignmentRoutes);
  app.use("/submissions", submissionRoutes);
  app.use("/users", userRoutes);
  app.use("/", authRoutes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
})();


