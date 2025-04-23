const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoute");
const employerRoutes = require("./routes/employers");
const jobSeekers = require("./routes/jobSeekers");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const path = require("path");
dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://job-web-application-frontend.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.options("*", cors());

const MONGO = process.env.DB_PASSWORD;
mongoose
  .connect(
    `mongodb+srv://anuragdubey16017:${MONGO}@cluster0.q1xsdru.mongodb.net/JOB`
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello Node.js" });
});
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join("/tmp/uploads", req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/superAdmin", userRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/users", jobSeekers);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
