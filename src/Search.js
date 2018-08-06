import React from 'react';
import ReactDOM from 'react-dom';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapControl } from 'react-leaflet'


export default class Search extends MapControl {

  createLeafletElement() {
    return GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'search'
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////
// import React from 'react';
// import ReactDOM from 'react-dom';
// import L from 'leaflet';
// import { MapControl } from 'react-leaflet';
// //
//
//
// export default class LegendControl extends MapControl {
//
//   componentWillMount() {
//     const legend = L.control({position: 'bottomright'});
//     const jsx = (
//       <div {...this.props}>
//         {this.props.children}
//       </div>
//     );
//
//     legend.onAdd = function (map) {
//       let div = L.DomUtil.create('div', '');
//       ReactDOM.render(jsx, div);
//       return div;
//     };
//
//     this.leafletElement = legend;
//   }
// }


///////////////////////////////////////////////////////////////////////////////////
