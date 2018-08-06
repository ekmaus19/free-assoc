import React, { createRef, Component } from 'react'
import { Map, TileLayer, Marker, Popup, CircleMarker, MapControl } from 'react-leaflet'
import { Button, Input, Grid } from 'semantic-ui-react'

// ultimately, geocoder will be in the backend. In front for testing purposes
const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim()


const findMe = {
  center: [51.505, -0.09],
  zoom: 13
}


////////////////////  test data to render markers on the page /////////////////////////////////////////////////

// 1. actual data
const data = [
  {"key": "1", "about": "music", "eventName":"Stand-Up Paddleboarding Lessons","time":"Ongoing","place":"1200 Clay, San Francisco","venueName":"Boardsports","tags":"Classes & Seminars, Outdoors, Arts", "lat": 37.793663, "long": -122.413103},
  // {"key": "2", "eventName":"Alcatraz Night Tour","time":"Mondays, Thursdays-Sundays","place":"San Francisco Bay, San Francisco","venueName":"Alcatraz Island","tags":"Tours, Outdoors, Arts"},
  // {"key": "3", "eventName":"Hiking Yoga","time":"Mondays-Saturdays","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"Mind & Body, Outdoors, Arts"},
  // {"key": "4", "eventName":"San Francisco City Guides Walking Tours","time":"Ongoing","place":"Multiple addresses, San Francisco","venueName":"Multiple San Francisco Locations","tags":"History, Tours, Free Events, Arts"},
  {"key": "5", "about":"art", "eventName":"Permanent Collection","time":"Ongoing, 10 a.m.-7 p.m.","place":"540 Broadway, San Francisco","venueName":"The Beat Museum","tags":"Museum Exhibits & Events, Art - Museums", "lat": 37.798056,"long": -122.406215}
]


// 2. fabricated data
// const data = [
//   { key: 'marker1', "lat": "37.793663", "long": -122.413103, "eventName": 'event1'},
//   { key: 'marker2', "lat": 37.798056,"long": -122.406215, 'eventName': 'event2' },
//   { key: 'marker3', "lat": 37.79056,"long": -122.40215, 'eventName': 'event3' },
// ]

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

export default class MainMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hasLocation: false,
        searchingPlace: null,
        latlng: {
          lat: 51.505,
          lng: -0.09,
        },
        viewport: findMe,
        about: null,
      }
      this.filterCategory = this.filterCategory.bind(this)
  }


  onSearchChange = (event) => {
    this.setState({
      searchingPlace: event.target.value
    })
  }

  findPlace = () => {
    console.log('we got here at least')
    geocoder.search( { q: this.state.searchingPlace } )
        .then((response) => {
            console.log(response)
            this.setState({
              latlng:{
                lat: response[0].lat,
                lon: response[0].lon
              }
            })
        })
        .catch((error) => {
            console.log(error)
      })
  }

  /// find an event of a given main category: WPS
  filterCategory(e) {
    e.preventDefault()
    console.log("Events being filetered: ", this.state);

    if(data.indexOf(this.state.about)===-1){

    }
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

  mapRef = createRef()

// determine location of present user
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

// locating particular cities: WPS
  // findInputPlace = (e)  => {
  //   for(var i=0; i< data.length; i++){
  //     if(data[i].place.indexOf(e.target.value)===-1) {
  //       this.setState({
  //
  //       })
  //     }
  //   }
  // }

// render the map interface
  render() {
    // locate present user on the map
    const marker = this.state.hasLocation ? (
      <CircleMarker center={this.state.latlng} radius={10}>
        <Popup>
          <span>You are here</span>
        </Popup>
      </CircleMarker>
    ) : null

    return (
      <Grid columns={2} divided>
        {/* <Grid.Column>
              <Grid.Row> */}
                <Input focus className="placeSearch" placeholder="Find a place..." onChange={this.onSearchChange}/>
                <Button onClick={this.findPlace}>Search</Button>
              {/* </Grid.Row> */}

              {/* <Grid.Row> */}
                  <Map
                    center={this.state.latlng}
                    length={4}
                    onLocationfound={this.handleLocationFound}
                    ref={this.mapRef}
                    // zoom={15}
                    viewport={this.state.viewport}>
                    <TileLayer
                      attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                      url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
                    />
                    <TestMarkerList data={data}/>

                    {/* past map tile of interest -- kept for reference */}

                    {/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                      // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                      id: 'mapbox.comic',
                      accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
                    }).addTo(this.map); */}

                    {marker}
                  </Map>
                {/* </Grid.Row> */}
        {/* </Grid.Column> */}
        {/* <Grid.Column> */}
          <Grid.Row><Button onClick={this.handleClick}>Find Me</Button></Grid.Row>
          <Grid.Row><Button onClick={(e) => { this.setState({about: "arts"}); this.filterCategory(e); }}>Visual Arts</Button></Grid.Row>
          <Grid.Row><Button onClick={(e) => { this.setState({about: "music"}); this.filterCategory(e); }}>Music</Button></Grid.Row>
          <Grid.Row><Button onClick={(e) => { this.setState({about: "performance"}); this.filterCategory(e); }}>Performance</Button></Grid.Row>
        {/* // </Grid.Column> */}
    </Grid>
    )
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// notes on maps : no more relevant content to map being generated in app
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
