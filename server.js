const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const testJwtRouter = require("./controllers/test-jwt")
const authRoutes = require("./controllers/auth.routes")
const verifyToken = require("./middleware/verify-token")
const planRoutes = require("./controllers/Plan.route")
const classesRoutes = require("./controllers/classes.routes")
const userRoutes = require("./controllers/user.routes")
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors({
  origin:process.env.FRONTEND_URL}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Routes go here
app.use("/auth",authRoutes)

app.use("/test-jwt",verifyToken,testJwtRouter)

app.use("/plan",planRoutes)

app.use("/classes",classesRoutes)

app.use("/user",userRoutes)
app.listen(3000, () => {
  console.log('The express app is ready!');
});
