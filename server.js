const express = require("express");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/", router);

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log("Server listening on port 3000.");
});
