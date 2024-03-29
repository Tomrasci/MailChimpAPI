const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
       members: [
           {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName
               }
           }
       ]
   };

   const jsonData = JSON.stringify(data);

   
   const url = 'https://us20.api.mailchimp.com/3.0/lists/6dd5e581fd'
   
   const options = {
       method: "POST",
       auth: "Tomras:1850e0c8804437fbc4dd73d090f67f95-us20"
   }
   const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
        console.log(JSON.parse(data));
    })
   })

   request.write(jsonData);
   request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 5000, function() {
    console.log("Server is running on port 5000");
})

//API KEY
// 1850e0c8804437fbc4dd73d090f67f95-us20

//Audience List Id
//6dd5e581fd