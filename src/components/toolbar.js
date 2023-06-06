import L from 'leaflet';
import { useMap } from "react-leaflet";
import React, { useEffect } from "react";

import 'leaflet-draw/dist/leaflet.draw-src';
import 'leaflet-toolbar';
import 'leaflet-toolbar/dist/leaflet.toolbar-src';

//set style
import 'font-awesome/css/font-awesome.min.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-toolbar/dist/leaflet.toolbar.css'

const Toolbars = (props) => {

    const map = useMap();
    useEffect(()=>{
        const drawnItems = new L.FeatureGroup().addTo(map);
        // new L.Toolbar2.DrawToolbar({
        //     position: 'topleft'
        // }).addTo(map);
        
        // new L.Toolbar2.EditToolbar.Control({
        //     position: 'topleft'
        // }).addTo(map, drawnItems);
    
        var ImmediateSubAction = L.Toolbar2.Action.extend({
            initialize: function (map, myAction) {
              this.map = map;
              this.myAction = myAction;
              L.Toolbar2.Action.prototype.initialize.call(this);
            },
            addHooks: function () {
              this.myAction.disable();
            }
          });
          var World = ImmediateSubAction.extend({
            options: {
              toolbarIcon: {
                html: 'World',
                tooltip: 'See the whole world'
              }
            },
            addHooks: function () {
              this.map.setView([0, 0], 0);
              ImmediateSubAction.prototype.addHooks.call(this);
            }
          });
          var Eiffel = ImmediateSubAction.extend({
            options: {
              toolbarIcon: {
                html: 'Eiffel Tower',
                tooltip: 'Go to the Eiffel Tower'
              }
            },
            addHooks: function () {
              this.map.setView([48.85815, 2.29420], 19);
              ImmediateSubAction.prototype.addHooks.call(this);
            }
          });
          
          var Cancel = ImmediateSubAction.extend({
            options: {
              toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
              }
            }
          });
      
          var MyCustomAction = L.Toolbar2.Action.extend({
            options: {
              toolbarIcon: {
                className: 'fa fa-eye',
              },
              subToolbar: new L.Toolbar2({
                actions: [World, Eiffel, Cancel]
              })
            }
          });
      
          new L.Toolbar2.Control({
            position: 'topleft',
            actions: [MyCustomAction]
          }).addTo(map);
      
        
        map.on('draw:created', function(evt) {
            var type = evt.layerType,
                layer = evt.layer;
        
            drawnItems.addLayer(layer);
        });
        return () => map;
    }, [map, props]);
    
    return null;
}

export default Toolbars;

