require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;
const userRoutes = require("./routes/users");

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'build')))
app.use(cors());
app.use(express.json());

// Routes
// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});
