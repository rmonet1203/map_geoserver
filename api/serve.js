const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
// const path = require('path');
const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eu_postgis',
  password: 'root',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/elevation', (req, res) => {
  const lat = req.body.lat;
  const lng = req.body.lng;
  console.log(lat + " " + lng);
  try {
    pool.query(
      `SELECT ST_Value(rast, 1, st_transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3035)) as elevation FROM eu_dem
        WHERE ST_Intersects(rast, st_transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 3035))`,
      [lng, lat],
      (error, results) => {
        if (error) {
          console.error(error);
          res.send('no result');
        } else {
          if(results && results.rows.length == 0){ 
            res.send('no result');
          }else{
            if(results.rows[0].elevation)
              res.send(results.rows[0].elevation.toString());
            else {
              res.send('no result');
            }
          }
        }
      }
    );  
  }  catch (error) {
    console.error(error);
    res.send('no result');
  }  
});
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});