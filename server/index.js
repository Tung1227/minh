const express = require("express")
const app = express();
const cors = require("cors");
var bodyParser = require('body-parser')

const pool = require("./db")

// middleware

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors({
    origin: "*",
}));

//ROUTE

//authenticator
app.use("/auth", require("./routes/authenticator"));

// dashboard 
app.use("/", require("./routes/dashboard"));

app.use("/post", require("./routes/post"));

app.use("/user", require("./routes/user"));
app.use("/address", require("./routes/address"));
app.use("/chatbot", require("./routes/chatbot"));
app.use("/admin", require("./routes/admin"));

app.use("/media", express.static("public"));

app.listen(5000, () => {

    console.log("server is started on port 5000!!!");
})
