import L, { bounds } from 'leaflet';

import { useMap, useMapEvents, } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
// import SpinnerControl from "./spinnerControl/SpinnerControl";
import SpinnerControl from "../Controls/SpinnerControl";
import ToolbarControl from '../Controls/ToolbarControl';

import axios from 'axios';
import 'leaflet-toolbar';
import 'leaflet-toolbar/dist/leaflet.toolbar.css';
import 'leaflet-toolbar/dist/leaflet.toolbar-src';
import 'font-awesome/css/font-awesome.min.css';

import 'leaflet/dist/leaflet.css';

import "../BetterWMS";




const wfs_url = 'http://localhost:8080/geoserver/wfs';
const buildings_layer = 'eu_postgis:buildings';
const googlmap_ApiKey = 'AIzaSyCQ37FgmzxObFYgNt0-bkmlHTVK0TSSFnU';
const getElevation = async (lat, lon) => {
  let ele = '';
  await axios.post('http://localhost:5000/elevation', {
    lat: lat,
    lng: lon
  })
    .then(response => {
      console.log(response.data);
      // elevation = response.data
      // return response.data;
      // setElevationData(response.data);
      ele = response.data;
    })
    .catch(error => {
      console.error(error);
      return 'no data';

    });
  return ele;
}

const infohtml = async (lat, lng, params) => {
  let html = '';
  var requestUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + googlmap_ApiKey;
  try {
    const response = await fetch(requestUrl);
    const data = await response.json();
    console.log(data.results);

    await getElevation(lat, lng).then(elevation => {
      html += `<b>Elevation: </b> ${elevation}<br>`;
      html += `<b>Address: </b> ${data.results[0].formatted_address}<br>`;
      html += `<div class = 'legend-separator'></div>`
    })
  } catch (e) {
    console.log(e);
  }

  // html +="<span class=\"street-address\">Norton</span>, <span class=\"postal-code\">62-600</span> <span class=\"locality\">Koło</span>, <span class=\"country-name\">Poland</span>";
  // html +=`<b>Address: </b> ${data.results[0].formatted_address}<br>`;
  // html +=`<div class = 'legend-separator'></div>`
  // let tags = params.tags.remove('{').remove('}').split(',');
  // for (let i = 0; i < tags.length; i++){
  //   html +=tags[i];
  // } 
  return html;
}


const MyMapEvent = (props) => {
  console.log(props.value);
  //create state 
  const [mapstate, setMapstate] = useState(null);
  var [isLoading, setIsLoading] = useState(false); // New state variable
  // var [isToolbar, setIsToolbar] = useState('hand');
  var isToolbar = 'hand';
  var elevation = '0';
  var flag = "no";
  const showLoadingSpinner = () => {
    document.getElementById("SpinnerControl").style.visibility = 'visible';
  }
  const hideLoadingSpinner = () => {
    document.getElementById("SpinnerControl").style.visibility = 'hidden';
  }

  const map = useMap();
  var geojsonLayre = {};

  const controlRef = React.useRef(null);
  useEffect(() => {
    if (!map) return;

    const customControler = L.Control.extend({
      options: {
        position: "topleft",
      },

      onAdd: function () {
        const toolbardiv = L.DomUtil.create('div', 'btn-group');
        L.DomEvent.addListener(toolbardiv, 'click', function (e) {
          // Handle the button click event here
          console.log('Button clicked!');
          // Stop the event from propagating to the map
          L.DomEvent.stopPropagation(e);
        });

        const btn_info = L.DomUtil.create("button", 'btn-info');
        btn_info.innerHTML = '<i class="fa fa-info-circle fa-lg"></i>';
        btn_info.title = "btn-info";
        btn_info.onmouseover = function () {
          this.style.transform = "scale(1.2)";
        };
        btn_info.onmouseout = function () {
          this.style.transform = "scale(1)";
        };
        btn_info.onclick = function () {
          // document.body.classList.add("rotate");
          console.log(isToolbar);
          isToolbar = 'info';

          // setIsToolbar('info'); 
        };

        const btn_maker = L.DomUtil.create("button", 'btn-info');
        btn_maker.innerHTML = '<i class="fa fa-map-marker fa-lg"></i>';
        btn_maker.title = "btn-info";
        btn_maker.onmouseover = function () {
          this.style.transform = "scale(1.2)";
        };
        btn_maker.onmouseout = function () {
          this.style.transform = "scale(1)";
        };
        btn_maker.onclick = function () {
          console.log(isToolbar);
          isToolbar = 'marker';
          // setIsToolbar('marker');
        };

        const btn_hand = L.DomUtil.create("button", 'btn-info');
        btn_hand.innerHTML = '<i class ="fa fa-hand-paper-o fa-lg"></i>';
        btn_hand.title = "btn-info";
        btn_hand.onmouseover = function () {
          this.style.transform = "scale(1.2)";
        };
        btn_hand.onmouseout = function () {
          this.style.transform = "scale(1)";
        };
        btn_hand.onclick = function () {
          console.log(isToolbar);
          isToolbar = 'hand';
          // setIsToolbar('hand');
        };
        toolbardiv.appendChild(btn_hand);
        toolbardiv.appendChild(btn_info);
        toolbardiv.appendChild(btn_maker);
        return toolbardiv;
      },
    });
    const newcustomctrl = new customControler();

    map.addControl(newcustomctrl);

    //
    const div = L.DomUtil.create("div", "description");
    const legend = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function () {
        // L.DomEvent.disableClickPropagation(div);  
        // const text = '<b>Coordinate: </b> idueu<br>dueduel ';
        // div.innerHTML = text;
        return div;
      }
    });
    const legendCTRL = new legend();

    // legend.addTo(map);
    map.addControl(legendCTRL);

    const info = L.DomUtil.create('div', 'legend');

    const positon = L.Control.extend({
      options: {
        position: 'bottomleft'
      },

      onAdd: function () {
        info.textContent = 'Click on map';
        return info;
      }
    });

    const positionCTRL = new positon(); //create ponsiotn method
    controlRef.current = positionCTRL;
    map.addControl(positionCTRL); //add on map


    SpinnerControl({ position: 'topleft' }).addTo(map); //add spinner on map 
    // const toolbar = ToolbarControl({ position: 'topleft' })
    // toolbar.addTo(map);
    map.on('mousemove', (e) => {
      info.textContent = e.latlng;
    });

    // Remove existing click event listeners
    map.off('click');

    map.on('click', (e) => {
      // console.log('click');
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      // getElevation(lat, lon);

      // if (flag == 'yes') div.textContent = "elevation: " + Math.ceil(elevation);
      // else div.textContent = "";
      const { x, y } = map.latLngToContainerPoint(e.latlng);
      console.log(map.getSize());
      // console.log(map.getPixelBounds());
      // console.log(map.getPixelWorldBounds());
      console.log(map.getBounds().toBBoxString());
      console.log(`${x} , ${y}`);
      // poland_fetch(map.getBounds().toBBoxString(), lat, lon, x, y);
    });

    const poland_fetch = async (bounds, lat, lng, x, y) => {
      console.log(x);
      console.log(y);

      const params = {
        service: 'WMS',
        request: 'GetFeatureInfo',
        VERSION: '1.1.1',
        QUERY_LAYERS: 'eu_poland:SkorowidzeNMPT2018',
        LAYERS: "eu_poland:SkorowidzeNMPT2018",
        info_format: 'application/json',
        SRS: 'EPSG:4326',
        BBOX: bounds,
        FORMAT: "image/png",

      }
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      const url = `http://83.24.196.20:8080/geoserver/eu_poland/wms?${queryString}`;
      console.log(`url: ${url}`);
      await fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }

    L.tileLayer.betterWms("http://localhost:8080/geoserver/wms?", {
      layers: 'eu_postgis:buildings',
      transparent: true,
      format: 'image/png'
    }).addTo(map);

    const fetchData = async (bounds) => {
      const bbox = bounds;//.toBBoxString();
      const url = `${wfs_url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${buildings_layer}&bbox=${bbox}&outputFormat=json`;
      let data = {};
      try {
        const response = await fetch(url).then(response => {
          data = response.json();
          map.removeLayer(geojsonLayre);
          geojsonLayre = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.tags);
              // layer.bindPopup(feature.properties.tags);
              layer.on('click', function (e) {
                setIsLoading(true); // Show spinner
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                // console.log(lat, lng, feature);
                infohtml(lat, lng, feature, layer).then(data1 => {
                  setIsLoading(false); // Hide spinner
                  div.innerHTML += data1;
                });
              });

              layer.on('mouseover', function (e) {
                // this.openPopup();
                this.setStyle({
                  fillColor: '#eb4034',
                  weight: 2,
                  color: '#eb4034',
                  fillOpacity: 0.7,
                })
              });

              layer.on('mouseout', function () {
                // this.closePopup();
                // style
                this.setStyle({
                  fillColor: '#3388ff',
                  weight: 2,
                  color: '#3388ff',
                  fillOpacity: 0.2,
                });
              });
            }
          }).addTo(map);
        }).then(error => {
          console.log(error);
        });

      } catch (error) {
        console.log(error);
        data = {};
      }



    }
    map.off('zoomstart movestart');
    map.on('zoomstart movestart', () => {
      // console.log('start-->')
      showLoadingSpinner();
    });
    map.off('zoomend moveend');
    map.on('zoomend moveend', () => {
      // console.log('end->>')
      // const layer = map.eachLayer
      //  const zoom = map.getZoom();
      // if (zoom > 16) {
      //   const bounds = map.getBounds();
      //   console.log(`bounds: ${bounds.toBBoxString()}`);
      //   fetchData(bounds.toBBoxString());
      //   hideLoadingSpinner();
      // }
      // else {
      //   map.removeLayer(geojsonLayre);
      //   hideLoadingSpinner();
      // } 
      hideLoadingSpinner();
    });

    return () => {
      map.removeControl(positionCTRL);
      map.removeControl(legendCTRL);
      map.removeControl(newcustomctrl);
      // map.removeControl(toolbar);
      map.off('click');
      map.off('zoomstart movestart');
    };

  }, [map]);

  return null

};

export default MyMapEvent;