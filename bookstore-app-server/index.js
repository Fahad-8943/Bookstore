// import all packages
// loads .env file content into process
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./Routes/routes");
require("./config/db");

// create server using express
const server = express();
// enable cors in server
server.use(cors());
// parse json to json content
server.use(express.json());
// use routes in server
server.use(router);

server.use("/uploads", express.static("./uploads"));

server.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "Profile picture must be 5 MB or smaller."
      : err.message;
    return res.status(400).json({ message });
  }
  if (err.message === "Profile picture must be an image.") {
    return res.status(400).json({ message: err.message });
  }
  return next(err);
});

// set up port number to run server in internet
const PORT = process.env.PORT;
//start server to listen client request to that port
server.listen(PORT, () => {
  console.log("server running and waiting for client request");
});
// resolve api(get request to http://localhost/3000/) using express

// handling gloabal errors in server using application middileware
server.use((err, req, res, next) => {
  res.status(500).json(err.message);
});

server.get("/", (req, res) => {
  res.status(200).send("<h1>Server running and waiting for client request ");
});

server.post("/", (req, res) => {
  res.status(200).send("POST REQEST");
});
