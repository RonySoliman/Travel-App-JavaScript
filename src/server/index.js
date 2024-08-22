const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const postRequest = './handle';
const GeoNames = 'api.geonames.org/postalCodeSearchJSON?';
const darkSky = 'api.darksky.net/forecast';
const pixabayAPI = 'pixabay.com/api';
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const PORT = 8081

app.listen(PORT, () => {
  console.log('TRAVEL APP LISTENING ON PORT ', PORT);
});

const fetchgeo = async (username, zipOrCity = '11230') => {
  const cityOrPostal = getpostal(zipOrCity);
  const url = `http://${GeoNames}${cityOrPostal}&maxRows=10&username=${username}`;
  try{
  return axios.get(url).then(response => {
    return response.data.postalCodes[0];
  });

  }catch(error){
    console.log("error ", error)
  }
};

const getpostal = zipOrCity => {
  try{

    if (/\d/.test(zipOrCity.value)) {
      return 'postalcode=' + zipOrCity;
    } else {
      return 'placename=' + zipOrCity;
    }

  }catch(error){
    console.log("error ", error)
  }
  
};

// geoNamesRoute
app.get('/geoNames', (req, res) => {

  const zip = req.query.zip;

  try{

    fetchgeo(process.env.username, zip).then(response => {
    res.end(JSON.stringify(response));
  });

  }catch(error){
    console.log("error ", error)
  }
  
});

const darksky = async (key, lat, long, time) => {
  const url = `https://${darkSky}/${key}/${lat},${long},${time}`;

  try{

    return await axios.get(url).then(response => {
      return response.data.daily.data[0];
    });

  }catch(error){
    console.log("error ", error)
  }
};

app.get('/darkSky', (req, res) => {
  const time = req.query.time;
  const lat = req.query.latitude;
  const long = req.query.longitude;

  try{

    darksky(process.env.key, lat, long, time).then(response => {
      res.end(JSON.stringify(response));
    });

  }catch(error){
    console.log("error ", error)
  }
  
});

const pixabay = async (pixabaykey, image) => {
  const url = `https://${pixabayAPI}/?key=${pixabaykey}&q=${image}`;

  return await axios.get(url).then(response => {
    try{

      if (response.data.totalHits != 0) {
        return response.data.hits[0].largeImageURL;
      }

    }catch(error){
      console.log("error ",error)
    }
  });
};

app.get('/pixabay', (req, res) => {
  const picture = req.query.image;
  try{

    pixabay(process.env.pixabaykey, picture).then(response => {
      res.end(JSON.stringify(response));
    });

  }catch(error){
    console.log("error ", error)
  }
  
});

module.exports = app;
