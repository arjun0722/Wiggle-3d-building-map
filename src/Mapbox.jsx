import React, { useEffect, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

const Mapbox = () => {

  const [center, SetCenter] = useState();


  // function successLocation(position) {
  //   
  //   SetCenter([position.coords.longitude, position.coords.latitude]);
  // }

  // function errorLocation() {
  //   SetCenter([-2.24, 53.48]);
  // }


 
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGV0c3VtaSIsImEiOiJjbGk4eTVpZ20wYXc5M2xvZWR0dTk4eWF4In0.ehSyd3IrxiMWuYURGbEK5A";
    // navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    //   enableHighAccuracy: true,
    // });

    const map = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-73.985664, 40.748514],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: "map",
      antialias: true,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
  
      controls: {
        profileSwitcher: false,
      },
      interactive: false,
      // styles: [
      //   {
      //     id: 'route', // Target the route line layer
      //     type: 'line',
      //     paint: {
      //       'line-color': 'goldenrod', // Set the color for the route line
      //       'line-width': 8,
      //     },
      //   },
      // ],
    });
  
  
    map.addControl(directions, "top-left");


    directions.on("route", (e) => {

      const mapStyle = map.getStyle();
      if (mapStyle) {
        const lineLayerId = "directions-route-line";
        const lineLayer = mapStyle.layers.find(
          (layer) => layer.id === lineLayerId
        );
        if (lineLayer) {
        // Remove the line border and set the color to goldenrod
        map.setPaintProperty(lineLayerId, "line-color", "#DAA520");
        map.setPaintProperty(lineLayerId, "line-opacity", 1);
        map.setPaintProperty(lineLayerId, "line-width", 9);
        map.setPaintProperty(lineLayerId, "line-gap-width", 0);
      }
      }



      const originCoords = e.route[0].legs[0].steps[0].intersections[0].location;

      const destinationCoords = e.route[0].legs[0].steps.slice(-1)[0].intersections.slice(-1)[0].location;
     

     

      if(destinationCoords){
        const el = document.createElement("div");
        el.className = "marker";


        new mapboxgl.Marker(el)
        .setLngLat(destinationCoords)
        .addTo(map);
      }

      if(originCoords){
        const el = document.createElement("div");
        el.className = "pointerdes";

        new mapboxgl.Marker(el)
        .setLngLat(originCoords)
        .addTo(map);

      }

    });


    map.on("style.load", () => {
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      ).id;

      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

           
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });
  }, []);

  return (
    <div
      id="map"
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    />
  );
};

export default Mapbox;
