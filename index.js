const express = require("express");
const app = express();
const port = 8000;
const axios = require("axios");
const cors = require("cors");

const instance_url = "https://rest.fra-02.braze.eu/users/track";

// send a api req to user's track endpoint
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 51428659-4917-4c00-ae05-b1fce9d0eb39",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
  res.send("Hello World!");
});

// app.get("/users/track", (req, res) => {
//   axios
//     .post(instance_url, data, {
//       headers: headers,
//     })
//     .then((res) => console.log(res));
// });

app.post("/users/track", (req, res) => {
  const data = req.body;
  axios
    .post(instance_url, data, {
      headers: headers,
    })
    .then((data) => console.log(data));

  res.send(201);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
