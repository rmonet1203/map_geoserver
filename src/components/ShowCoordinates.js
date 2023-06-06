import React, { useEffect, useState} from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

import L from 'leaflet';
import SpinnerControl from "./spinnerControl/SpinnerControl";



const GetCoordinates = () => {

  const showLoadingSpinner = () => {
    document.getElementById("SpinnerControl").style.visibility = 'visible';
  }
  const hideLoadingSpinner = () => {
    document.getElementById("SpinnerControl").style.visibility = 'hidden';
  }

    const map = useMap();

    // useMapEvents({
    //   mousemove: (e) =>{
    //     // info.textContent = e.latlng;
    //     // console.log(e);
    //   },
      
    //   loading: () => {
    //     // setLoading(true);
    //     console.log('loading----->');
    //     document.getElementById("SpinnerControl").style.visibility = 'visible';
    //   },
    //   load: () => {
    //     console.log('load----->');
    //     document.getElementById("SpinnerControl").style.visibility = 'hidden';
    //   },
    //   zoomstart: () =>{
    //     console.log('zoomstart----->');
    //   }
    // });
    
    const controlRef = React.useRef(null);
  
    useEffect(() => {
      if (!map) return;
      
      const info = L.DomUtil.create('div', 'legend');
      
  
      const positon = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
  
        onAdd: function () {
          info.textContent = 'Click on map';
          return info;
        }
      })
  
      const positionCTRL = new positon();
      controlRef.current = positionCTRL;
     

      map.addControl(positionCTRL);   
      SpinnerControl({position: 'topleft'}).addTo(map);

      map.on('mousemove', (e) => {
        info.textContent = e.latlng;
      })      

     map.on('zoomstart movestart', () => {
      console.log('start-->')
        showLoadingSpinner();
      });

      map.on('zoomend moveend', () => {
        // console.log('end->>')

        const zoom = map.getZoom();
        if(zoom > 15) {
          const bounds = map.getBounds();
          fetchData(bounds.toBBoxString());
        }
        else hideLoadingSpinner();
      });
  
      return () => {
        map.removeControl(positionCTRL);
      };
  
    }, [map])
  
    return null
  }

  export default GetCoordinates;