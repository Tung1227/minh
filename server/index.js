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
app.use(cors());

//ROUTE

//authenticator
app.use("/auth", require("./routes/authenticator"));

// dashboard 
app.use("/dashboard", require("./routes/dashboard"));

app.use("/post", require("./routes/post"))


app.listen(5000, () => {

    console.log("server is started on port 5000!!!");
})
