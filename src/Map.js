


// import logo from './logo.svg';
// import './index.css';
//
// import React, { Component } from 'react'
// import L from 'leaflet';
// export default class App extends React.Component {
//
//   componentDidMount() {
//     // create map
//     this.map = L.map('map').setView([51.505, -0.09], 13);
//     L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//       // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//       id: 'mapbox.comic',
//       accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
//     }).addTo(this.map);
//     L.control.locate().addTo(this.map)
//   }
//
//   render() {
//     return <div id="map"></div>
//   }
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
import React, { createRef, Component } from 'react'
import { Map, TileLayer, Marker, Popup, CircleMarker, MapControl } from 'react-leaflet'
import { Button, Input } from 'semantic-ui-react'
import  Search from './Search'
var geocoder = require('geocoder');


const findMe = {
  center: [51.505, -0.09],
  zoom: 13
}

const data = [
  {"key": "1", "eventName":"Stand-Up Paddleboarding Lessons","time":"Ongoing","place":"1200 Clay, San Francisco","venueName":"Boardsports","tags":"Classes & Seminars, Outdoors, Arts", "lat": 37.793663, "long": -122.413103},
  // {"key": "2", "eventName":"Alcatraz Night Tour","time":"Mondays, Thursdays-Sundays","place":"San Francisco Bay, San Francisco","venueName":"Alcatraz Island","tags":"Tours, Outdoors, Arts"},
  // {"key": "3", "eventName":"Hiking Yoga","time":"Mondays-Saturdays","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"Mind & Body, Outdoors, Arts"},
  // {"key": "4", "eventName":"San Francisco City Guides Walking Tours","time":"Ongoing","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"History, Tours, Free Events, Arts"},
  {"key": "5", "eventName":"Permanent Collection","time":"Ongoing, 10 a.m.-7 p.m.","place":"540 Broadway, San Francisco","venueName":"The Beat Museum","tags":"Museum Exhibits & Events, Art - Museums", "lat": 37.798056,"long": -122.406215}
]
// console.log("json data: ", data)

// data1 = JSON.parse(data)
// console.log("data printing: ", data1)

// const data = [
//   { key: 'marker1', "lat": "37.793663", "long": -122.413103, "eventName": 'event1'},
//   { key: 'marker2', "lat": 37.798056,"long": -122.406215, 'eventName': 'event2' },
//   { key: 'marker3', "lat": 37.79056,"long": -122.40215, 'eventName': 'event3' },
// ]

const TestPopupMarker = ({ eventName, lat, long }) =>(
   <Marker position={[lat, long]}>
     <Popup>{eventName}</Popup>
   </Marker>
 )


const TestMarkerList = ({ data }) => {
  const items = data.map(({ key, ...props}) => (
    <TestPopupMarker key={key} {...props}></TestPopupMarker>
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hasLocation: false,
        latlng: {
          lat: 51.505,
          lng: -0.09,
        },
        viewport: findMe,
        about: null,
        // display relevant points

      }
      this.filterCategory = this.filterCategory.bind(this)
  }


  /// find an event of a given main category
  filterCategory(e) {
    e.preventDefault()
    console.log("Events being filetered: ", this.state);
    // this.props.socket.emit('filterCategory', {
    //   about: this.state.about
    // }, (res) => {
    //   console.log(res)
    //   if(res.err) {
    //     return alert('There was an error');
    //   } else {
    //     alert('Filter went through.')
    //   }
    // })
  }

  ///
  mapRef = createRef()

  handleClick = () => {
    this.mapRef.current.leafletElement.locate()
  }

  handleLocationFound = e => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
      viewport: {
        center: e.latlng,
      },
    })
  }

  // findInputPlace = (e)  => {
  //   for(var i=0; i< data.length; i++){
  //     if(data[i].place.indexOf(e.target.value)===-1) {
  //       this.setState({
  //
  //       })
  //     }
  //   }
  // }

  render() {

    // const data = [
    //   {"key": "1", "eventName":"Stand-Up Paddleboarding Lessons","time":"Ongoing","place":"1200 Clay, San Francisco","venueName":"Boardsports","tags":"Classes & Seminars, Outdoors, Arts", "lat": "37.793663", "long": "-122.413103"},
    //   // {"key": "2", "eventName":"Alcatraz Night Tour","time":"Mondays, Thursdays-Sundays","place":"San Francisco Bay, San Francisco","venueName":"Alcatraz Island","tags":"Tours, Outdoors, Arts"},
    //   // {"key": "3", "eventName":"Hiking Yoga","time":"Mondays-Saturdays","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"Mind & Body, Outdoors, Arts"},
    //   {"key": "4", "eventName":"San Francisco City Guides Walking Tours","time":"Ongoing","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"History, Tours, Free Events, Arts"},
    //   {"key": "5", "eventName":"Permanent Collection","time":"Ongoing, 10 a.m.-7 p.m.","place":"540 Broadway, San Francisco","venueName":"The Beat Museum","tags":"Museum Exhibits & Events, Art - Museums", "lat": "37.798056","long": "-122.406215"}
    // ]

    const marker = this.state.hasLocation ? (
      <CircleMarker center={this.state.latlng} radius={10}>
        <Popup>
          <span>You are here</span>
        </Popup>
      </CircleMarker>
    ) : null

    return (
    <div>
      <Input focus action="Search" className="placeSearch" placeholder="Find a place..."/>
      <Map
        center={this.state.latlng}
        length={4}
        onLocationfound={this.handleLocationFound}
        ref={this.mapRef}
        // zoom={15}
        viewport={this.state.viewport}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png"
        />
        <TestMarkerList data={data}/>

        {/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.comic',
          accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
        }).addTo(this.map); */}
        {marker}
        {/* <Search></Search> */}
      </Map>
      <Button onClick={this.handleClick}>Find Me</Button>
      <Button onClick={(e) => { this.setState({about: "arts"}); this.filterCategory(e); }}>Visual Arts</Button>
      <Button onClick={(e) => { this.setState({about: "music"}); this.filterCategory(e); }}>Music</Button>
      <Button onClick={(e) => { this.setState({about: "performance"}); this.filterCategory(e); }}>Performance</Button>



    </div>
    )
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////
/// Working example done with react-leaflet
//////////////////////////////////////////////

// import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
// import ReactDOM from 'react-dom'
// import React, { Component } from 'react'
//
// export default class App extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       // user lat
//       // user long
//       // events lat
//       // events long
//       lat: 51.505,
//       lng: -0.09,
//       zoom: 13
//     }
//   }
//
//   render() {
//     const position = [this.state.lat, this.state.lng];
//     return (
//         <div>
//           <LeafletMap center={position} zoom={this.state.zoom}>
//             <TileLayer
//               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//               url='https://api.mapbox.com/styles/v1/ekmaus19/cjkaawem56j4j2rmc9wf1jahd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q'
//             />
//              <Marker position={position}>
//                <Popup>
//                  A pretty CSS3 popup. <br /> Easily customizable.
//                </Popup>
//              </Marker>
//           </LeafletMap>
//         </div>
//     );
//   }
// }


// export default class App extends Component {
//   state = {
//     lat: 51.505,
//     lng: -0.09,
//     zoom: 13,
//   }
//
//   render() {
//     const position = [this.state.lat, this.state.lng]
//     return (
//       <Map center={position} zoom={this.state.zoom}>
//         <TileLayer
//           attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position}>
//           <Popup>
//             A pretty CSS3 popup. <br /> Easily customizable.
//           </Popup>
//         </Marker>
//       </Map>
//     )
//   }
// }

//////////////////////
/// notes on maps
/////////////////////

// var mymap = L.map('mapid').setView([51.505, -0.09], 13);
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//   // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   id: 'mapbox.high-contrast',
//   accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
// }).addTo(mymap)
//
// // add event here
// var marker = L.marker([51.5, -0.09]).addTo(mymap);
// var circle = L.circle([51.508, -0.11], {
//   color: 'pink',
//   fillColor: '#f03',
//   fillOpacity: 0.5,
//   radius: 500
// }).addTo(mymap);
