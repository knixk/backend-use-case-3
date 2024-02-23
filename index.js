const express = require("express");
const app = express();
const port = 8000;
const axios = require("axios");
const cors = require("cors");
const { v4 } = require("uuid");
const data = require("./db.json");

console.log(data);
const track_url = "https://rest.fra-02.braze.eu/users/track";
const alias_url = "https://rest.fra-02.braze.eu/users/alias/new";
const identify_url = "https://rest.fra-02.braze.eu/users/identify";

// send a api req to user's track endpoint
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 51428659-4917-4c00-ae05-b1fce9d0eb39",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// data.map((i) => {
//   console.log(i.email[0]);
// });

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
  // console.log(data);

  // something with data

  const alias = {
    user_aliases: [
      {
        alias_name: "email",
        alias_label: data.email,
      },
    ],
  };

  const userData = {
    attributes: [
      {
        email: data.email,
        signed_up_email: true,
      },
    ],
    events: [
      {
        name: "Signed up for email",
        time: data.timestamp,
      },
    ],
  };


  console.log(userData)

  // axios
  //   .post(alias_url, data, {
  //     headers: headers,
  //   })
  //   .then((data) => console.log(data));

  // axios
  //   .post(track_url, data, {
  //     headers: headers,
  //   })
  //   .then((data) => console.log(data));

  res.send(201);
});

app.post("/identify", (req, res) => {
  const data = req.body;

  const user_id = v4()

  const identify = {
    aliases_to_identify: [
      {
        external_id: user_id,
        user_alias: {
          alias_name: "email",
          alias_label: "kirti@email.com",
        },
      },
    ],
    merge_behavior: "merge",
  };

  console.log(identify)
  // axios
  //   .post(instance_url, data, {
  //     headers: headers,
  //   })
  //   .then((data) => console.log(data));
  res.send(identify);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
