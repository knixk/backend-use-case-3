const express = require("express");
const app = express();
const port = 8000;
const axios = require("axios");
const cors = require("cors");
const { v4 } = require("uuid");
const data = require("./db.json");
const fs = require("fs");

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

app.get("/", cors(), (req, res) => {
  res.send("Hello World!");
});

/*

@@@POST /users/track

*/

app.post("/users/track", (req, res) => {
  const data = req.body;
  console.log(data);
  // creating alias
  const alias = {
    user_aliases: [
      {
        alias_name: data.email,
        alias_label: "email",
      },
    ],
  };

  // sending data
  const userData = {
    attributes: [
      {
        email: data.email,
        user_alias: {
          alias_name: data.email,
          alias_label: "email",
        },
      },
    ],
  };
  try {
    axios.post(alias_url, alias, {
      headers: headers,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    axios.post(track_url, userData, {
      headers: headers,
    });
  } catch (error) {
    console.log(error);
  }
});

const searchInArr = (key) => {
  let ans = false;
  data.map((i) => {
    const userEmail = i.email[0];
    if (userEmail === key) {
      ans = i.email[1];
    }
  });
  return ans;
};

const addToArr = (o) => {
  const update = [...data, o];

  fs.writeFile("./db.json", JSON.stringify(update), (err) => {
    if (err) throw err;
  });

  // [...data, {}]
};

/*

@@@POST /users/track

*/

app.post("/identify", (req, res) => {
  const data = req.body;

  console.log(data);

  const user_id = v4();

  const found = searchInArr(data.email);

  if (found) {
    res.send(found);
    console.log(found);
    console.log("Found existing id");
    return;
  }

  const identify = {
    aliases_to_identify: [
      {
        external_id: user_id,
        user_alias: {
          alias_name: data.email,
          alias_label: "email",
        },
      },
    ],
    merge_behavior: "merge",
  };

  try {
    axios
      .post(identify_url, identify, {
        headers: headers,
      })
      .then((data) => console.log(data));
  } catch (error) {
    console.log(error);
  }

  let obj = { email: [data.email, user_id] };

  addToArr(obj);

  res.send(user_id);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
