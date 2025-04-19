const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoute');
const employerRoutes = require('./routes/employers');
const { default: mongoose } = require('mongoose');

dotenv.config();

const MONGO = process.env.DB_PASSWORD;
mongoose
  .connect(
    `mongodb+srv://anuragdubey16017:${MONGO}@cluster0.q1xsdru.mongodb.net/JOB`,
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employers', employerRoutes);
const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));