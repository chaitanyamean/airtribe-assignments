require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { PORT } = process.env;
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("459e08aa4f0f46b687b99c49d12be618");
const bcrypt = require("bcryptjs");
const { v1: uuidv1 } = require("uuid");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");

let users = [
  {
    email: "user1@gmail.com",
    password: "123456",
    userId: "123",
  },
  {
    email: "user2@gmail.com",
    password: "123456",
    userId: "456",
  },
  {
    email: "user3@gmail.com",
    password: "123456",
    userId: "789",
  },
];

let preferenceData = [
  {
    userId: "123",
    preference: ["health", "business"],
  },
  {
    userId: "456",
    preference: ["general", "sports"],
  },
  {
    userId: "789",
    preference: ["technology", "entertainment"],
  },
];

app.get("/news", (req, res) => {
  newsapi.v2
    .sources({
      category: "health",
      language: "en",
      country: "us",
    })
    .then((response) => {
      res.json({
        data: response,
        status: "SUCCESS",
      });
    });
});

// Registration
app.post("/register", (req, res) => {
  let { email, password } = req.body;

  let isExistingUser = users.find((user) => user.email === email);

  if (isExistingUser) {
    res.json({
      message: "User Already Exists",
      status: "Failed",
    });
  } else {
    let salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    let newUserObj = {
      email,
      password: hash,
      userId: uuidv1(),
    };

    users.push(newUserObj);

    res.json({
      status: "Success",
      message: "Added new User",
      user: newUserObj,
    });
  }
});

// get users
app.get("/users", (req, res) => {
  res.json({
    users,
  });
});

// LOGIN
// Registration
app.post("/login", (req, res) => {
  let { email, password } = req.body;

  let isExistingUser = users.find((user) => user.email === email);

  if (!isExistingUser) {
    res.json({
      message: "User Not Exists",
      status: "Failed",
    });
  } else {
    // let salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);
    let isPasswordValid = bcrypt.compareSync(password, isExistingUser.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { user_id: isExistingUser.email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      users.find((user) => {
        if (user.email === email) {
          user["token"] = token;
        }
      });
      res.json({
        message: "User logged in successfully",
        status: "Success",
        users,
      });
    } else {
      res.json({
        message: "Password not matched",
        status: "Failed",
      });
    }
  }
});

// Preference

app.get("/preference", auth, (req, res) => {
  // preferenceData

  const { userId } = req.body;

  let userObj = preferenceData.find(
    (preference) => preference.userId == userId
  );
  let preferenceNewData = [];
  if (userObj) {
    for (let item of userObj.preference) {
      newsapi.v2
        .sources({
          category: item,
          language: "en",
          country: "us",
        })
        .then((response) => {
          preferenceNewData.push(response.sources);
        });
    }
    setTimeout(() => {
      res.json({
        preference: userObj.preference,
        status: "Success",
        preferredNews: preferenceNewData,
      });
    }, 1000);
  } else {
    res.json({
      preference: userObj.preference,
      status: "Failed",
      message: "No user found",
    });
  }
});

// Update preference

app.put("/preference", auth, (req, res) => {
  const { userId, preference } = req.body;
  let isUserFound = false;
  preferenceData.find((item) => {
    if (item.userId == userId) {
      item.preference = preference;
      isUserFound = true;
    }
  });
  if (isUserFound) {
    res.json({
      status: "Success",
      message: "Preference Updated Successful",
    });
  } else {
    res.json({
      status: "Failed",
      message: "No user found",
    });
  }
});

app.listen(PORT, () => console.log("Server is running at", PORT));
