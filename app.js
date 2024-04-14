require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//router
const authRouter = require("./routes/auth");
const appointment = require("./routes/appointment");
const doctor = require("./routes/doctor")



// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


//extra security 
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

//connect database
const connectDB = require("./db/connect");
//authentication 
const userAuthentication = require("./middleware/authentication")

// extra packages
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());



// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/appointment",userAuthentication, appointment);
app.use("/api/v1/doctor",userAuthentication,doctor)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
