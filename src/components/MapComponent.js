import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, ScaleControl, LayersControl, GeoJSON, useMapEvent } from 'react-leaflet';
import axios from "axios";
//search component
import { OpenStreetMapProvider } from "leaflet-geosearch";
import SearchField from "./SearchControl";




import L, { Layer } from "leaflet";
import { useMap, WMSTileLayer } from 'react-leaflet';
import GetEventMap from './MapEvents/mapEvent';

// import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
// import { faCoffee } from '@fontawesome/free-solid-svg-icons';
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadowIcon from "leaflet/dist/images/marker-shadow.png";
// import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

const wms_url = "http://localhost:8080/geoserver/wms";
const wfs_url = 'http://localhost:8080/geoserver/wfs';
const buildings_layer = 'eu_postgis:buildings';
const roads_layer = 'eu_postgis:roads';
const points_layer = 'eu_postgis:pois';
const params_building = {
  layers: buildings_layer,
  format: 'image/png',
  transparent: true,
  version: '1.1.1',
  crs: L.CRS.EPSG4326,
  minZoom: 14,
  maxZoom: 18
};

const params_road = {
  layers: roads_layer,
  format: 'image/png',
  transparent: true,
  version: '1.1.1',
  crs: L.CRS.EPSG4326,
  minZoom: 13,
  maxZoom: 18
};
const params_point = {
  layers: points_layer,
  format: 'image/png',
  transparent: true,
  version: '1.1.1',
  crs: L.CRS.EPSG4326,  
  minZoom: 14,
  maxZoom: 18
};

const CustomWMSLayer = ()=> {
  const wmsLayerRef = useRef(null);

  const handleWMSLayerClick = (e) => {
    if (!wmsLayerRef.current || !wmsLayerRef.current.options.layers) {
      return;
    }
    const url = wmsLayerRef.current._url;
    const params = {
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      layers: wmsLayerRef.current.options.layers,
      query_layers: wmsLayerRef.current.options.layers,
      bbox: wmsLayerRef.current.getBounds().toBBoxString(),
      width: wmsLayerRef.current._map.getSize().x,
      height: wmsLayerRef.current._map.getSize().y,
      x: Math.round(wmsLayerRef.current._map.latLngToContainerPoint(e.latlng).x),
      y: Math.round(wmsLayerRef.current._map.latLngToContainerPoint(e.latlng).y),
      info_format: 'text/xml',
    };

    const requestUrl = `${url}?${Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')}`;

    fetch(requestUrl)
      .then((response) => response.text())
      .then((responseText) => {
        // Parse the XML response and extract the feature information
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, 'text/xml');
        const featureInfo = xmlDoc.getElementsByTagName('featureInfo')[0].textContent;

        console.log(featureInfo);
      });
    }

    return (
      <WMSTileLayer
        ref={wmsLayerRef}
        url="http://83.24.196.20:8080/geoserver/eu_poland/wms"
        layers="eu_poland:SkorowidzeNMPT2017iStarsze,eu_poland:SkorowidzeNMPT2018"
        format="image/png"
        transparent={true}
        onClick={handleWMSLayerClick}
      />
    );
};
function handleWmsTileClick(event) {
  console.log("// Handle the click event here");
  console.log( "Handle the click event here");
}
const MapDisplay = () => {

  const prov = new OpenStreetMapProvider();
  const [isvalue, setIsvalue] = useState("nu9999ll");
  const [selectedLayers, setSelectedLayers] = useState([]);
   // Function to handle layer selection changes and update selectedLayers state
   const handleLayerSelection = (event) => {
    const selectedLayerName = event.name;
    console.log(event.name);

    if (!selectedLayers.includes(selectedLayerName)) {
      setSelectedLayers([...selectedLayers, selectedLayerName]);
    } else {
      setSelectedLayers(selectedLayers.filter(layer => layer !== selectedLayerName));
    }
  };

  return (
    <MapContainer center={[52, 19.2]} zoom={10}>
      <ScaleControl imperial={false} />      
      <SearchField
        provider={prov}
        showMarker={false}
        showPopup={false}
        popupFormat={({ query, result }) => result.label}
        retainZoomLevel={false}
        animateZoom={true}
        autoClose={false}
        searchLabel={"Enter address, please"}
        keepResult={true}
      // addMarker={handleAddMarker}
      />
    <GetEventMap value = {isvalue}></GetEventMap>
      <LayersControl position="topright" collapsed={false}>
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="roads" onChange={handleLayerSelection}>
          <WMSTileLayer url={wms_url} {...params_road} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="buildings">
          <WMSTileLayer url={wms_url} {...params_building}/>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="points">
          <WMSTileLayer url={wms_url} {...params_point} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="river_network">
          <WMSTileLayer
            url="http://localhost:8080/geoserver/wms"
            layers="eu_postgis:river_net_l"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="inlandwater">
          <WMSTileLayer
            url="http://localhost:8080/geoserver/eu_postgis/wms"
            layers="eu_postgis:inlandwater"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="land_rigister_gminy">
          <WMSTileLayer
            url="http://83.24.196.20:8080/geoserver/eu_poland/wms"
            layers="eu_poland:gminy"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="land_rigister_studium">
          <WMSTileLayer
            url="http://83.24.196.20:8080/geoserver/eu_poland/wms"
            layers="eu_poland:studium"
            format="image/png"
            transparent={true}
            version="1.1.0"
          />
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="land_rigister_elevation">
          
          <WMSTileLayer
            url="http://83.24.196.20:8080/geoserver/eu_poland/wms"
            layers="eu_poland:SkorowidzeNMPT2017iStarsze,eu_poland:SkorowidzeNMPT2018"
            format="image/png"
            transparent={true}
            version="1.1.0" 
          />
        </LayersControl.Overlay> */}

      </LayersControl>
    </MapContainer>
  );
};


export default MapDisplay;