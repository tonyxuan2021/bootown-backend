const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// /api/users/register

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please enter the required Failed");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // create new user
  const newUser = {
    email: email,
    password: hashedPassword,
  };

  knex("btusers")
    .insert(newUser)
    .then(() => {
      res.status(201).send("Registered successfully");
    })
    .catch(() => {
      res.status(400).send("failed registration");
    });
});

// LOGIN

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("please enter the required field");
  }

  // find the user

  knex("btusers")
    .where({ email: email })
    .first()
    .then((user) => {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).send("Invalid password");
      }

      // create a token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.json({ token });
    })
    .catch(() => {
      res.status(400).send("invalid credentials");
    });
});

// GET INFORMATION ABOUT THE CURRENT LOGGED IN USER

router.get("/current", (req, res) => {
  // If there no auth header provided
  if (!req.headers.authorization) {
    return res.status(401).send("Please login");
  }

  const authToken = req.headers.authorization.split(" ")[1];

  // Verify the token
  jwt.verify(authToken, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid auth token");
    }

    knex("btusers")
      .where({ email: decoded.email })
      .first()
      .then((user) => {
        // respond with user date
        delete user.password;
        res.json(user);
      });
  });
});

module.exports = router;
