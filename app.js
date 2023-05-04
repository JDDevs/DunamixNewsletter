
// nodejs express server and axios
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require("axios");
const https = require("https");
// MAILCHIMP SERVER CONNECTION
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: "e3f314c75ed4cdc83b41b7077e99f407-us11",
    server: "us11",
  });

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Reemplaza la ruta con la ubicación de tu página HTML
});

app.post("/", async function(req, res) {
  var fullName = req.body.fullName;
  var userEmail = req.body.userEmail;
  var fName;
  var lName;

  function fullNameSplitter(fullName) {
    // Divide el nombre completo en un arreglo de palabras
    const textName = fullName.split(' ');

    // El primer elemento es el primer nombre
    const firstName = textName[0];

    // El resto de las palabras son parte del apellido
    const lastName = textName.slice(1).join(' ');

    // Retorna un objeto con el primer nombre y el apellido
    return {
      firstName,
      lastName,
    };
  }

  const nameObj = fullNameSplitter(fullName);
  fName = nameObj.firstName;
  lName = nameObj.lastName;

  console.log(lName, fName, userEmail);

  // Batch subscribe or unsubscribe MAILCHIMP

  const postData = async () => {
    const response = await mailchimp.lists.batchListMembers("7d4c71fb88", {
      members: [
        {
          email_address: userEmail,
          status: "subscribed",
          merge_fields: {
            FNAME: fName,
            LNAME: lName,
          },
        },
      ],
    });
    console.log(response);
    return response;
  };

  try {
    const response = await postData();
    console.log(response.statusCode);
    res.status(200).sendFile(__dirname + "/success.html");
  } catch (err) {
    console.error(err);
    res.status(404).sendFile(__dirname + "/error.html");
  }
});



// res.status(200).sendFile(__dirname + "/success.html");


 
  // async function run() {
  //   const response = await mailchimp.ping.get();
  //   console.log(response);
  // }
  
  // run();

// ----------------------------------------------------------------





// API KEY
// e3f314c75ed4cdc83b41b7077e99f407-us11

// LIST ID
// 7d4c71fb88


app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${}!`));