import React from "react";
import L from "leaflet";
import states from "./states.json";

const style = {
  width: "100%",
  height: "100vh",
};

const mapStyle = (feature) => {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density),
  };
};

const getColor = (d) => {
  return d > 400
    ? "#800026"
    : d > 300
    ? "#BD0026"
    : d > 250
    ? "#E31A1C"
    : d > 150
    ? "#FC4E2A"
    : d > 100
    ? "#FD8D3C"
    : d > 75
    ? "#FEB24C"
    : d > 50
    ? "#FED976"
    : "#FFEDA0";
};

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [37.8, -96],
      zoom: 4,
      layers: [
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/engmapbox/ckr6976ld15mj17m51dau1sa3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZW5nbWFwYm94IiwiYSI6ImNqY3M1ZXA5czM2ZGYzM283ZmhscDltcGMifQ.Za7ut_7UThGzvjWhX4ACJQ",
          {
            maxZoom: 18,
            attribution:
              'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: "streets-v9",
          }
        ),
      ],
    });

    this.geojson = L.geoJson(states, {
      style: mapStyle,
      onEachFeature: this.onEachFeature,
    }).addTo(this.map);

    this.info = L.control();

    this.info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    this.info.update = function (props) {
      this._div.innerHTML = props
        ? "<b>" + props.name + "</b><br />" + props.density + ""
        : "Hover over a state";
    };

    this.info.addTo(this.map);

    // add layer
    this.layer = L.layerGroup().addTo(this.map);
  }
  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.zoomToFeature,
    });
  };
  highlightFeature = (e) => {
    var layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    layer.bringToFront();

    this.info.update(layer.feature.properties);
  };

  resetHighlight = (event) => {
    this.geojson.resetStyle(event.target);
    this.info.update();
  };
  zoomToFeature = (e) => {
    this.map.fitBounds(e.target.getBounds());
  };

  render() {
    return (
      <>
        <div id="map" style={style} />
      </>
    );
  }
}

export default Map;
