import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import React, { useEffect } from "react";
// import L from "leaflet";

import 'leaflet-geosearch/dist/geosearch.css';
import '../styles/searchControl.css';

const SearchControl = (props) => {
    const map = useMap();
  
    // const searchControl = new GeoSearchControl({
    //   provider: new OpenStreetMapProvider()
    // });
  
    useEffect(() => {
      const searchControl = new GeoSearchControl({
        provider: props.provider,        
        ...props
      });
      map.addControl(searchControl);
      // map.on("geosearch/showlocation", function (e) {
      //   e.Locations.forEach(function (Location) {
      //     // Location.Label = full address
      //     // Location.X = longitude
      //     // Location.Y = latitude
      //     // Location.bounds = boundaries
      //     let marker = {
      //       name: Location.Label,
      //       position: [Location.X, Location.Y]
      //     };
      //     props.addMarker(marker);
      //   });
      // });
  
      // https://stackoverflow.com/questions/35384869/leaflet-geosearch-return-lat-lng-from-address-found-event
      map.on("geosearch/showlocation", function (e) {
        // let marker = {
        //   name: e.location.label,
        //   position: [e.location.x, e.location.y]
        // };
        console.log(e.location);
        // props.addMarker(marker);
      });
      return () => map.removeControl(searchControl);
      // return () => map.removeControl(searchControl);
    }, [map, props]);
  
    return null;
  };
  export default SearchControl;
  