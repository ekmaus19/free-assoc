import React, { createRef, Component } from 'react'
import { Map, TileLayer, Marker, Popup, CircleMarker, MapControl } from 'react-leaflet'
import { Button, Input, Grid, Segment, Form } from 'semantic-ui-react'
import url from './backend'
import L from 'leaflet'
import DivIcon from 'react-leaflet-div-icon';


// ultimately, geocoder will be in the backend. In front for testing purposes
const Nominatim = require('nominatim-geocoder')
var geocoderReverse = require('geocoder');

const geocoder = new Nominatim()

const findMe = {
  center: [51.505, -0.09],
  zoom: 13
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// popup work

const pink_button = "https://webiconspng.com/wp-content/uploads/2017/09/Clothes-Button-PNG-Image-12924.png"
const blue_button = "http://purepng.com/public/uploads/large/purepng.com-blue-sewing-button-with-4-holecloth-buttonspatternsewingsewing-accessoriesclip-artblue-1421526305532cwfxq.png"
const green_button = "http://purepng.com/public/uploads/large/purepng.com-greent-round-buttoncloth-buttonspatternsewingsewing-accessoriesgreenclipart-14215263044871jstt.png"

const iconsImages = [pink_button, blue_button, green_button]
const icons = []
for(var i=0; i < iconsImages.length ; i++) {
  var iconMake = L.icon({
    iconUrl: icons[i],
    iconSize: [38, 95], // size of the icon
    popupAnchor: [0,-15]
    });

  icons.push(iconMake)
}

const iconUse = (medium) => {
  if(medium === "art") {
    return  icons[2]
  } else if (medium === 'performance') {
    return icons[0]
  } else if (medium === 'music') {
    return icons[1]
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let splitUserLoc


const filterIcon = (medium) => {
  if(medium === "art") {
    return L.icon({ iconUrl: blue_button, iconSize: [25, 25] })
  } else if (medium === 'performance') {
    return L.icon({ iconUrl: pink_button, iconSize: [25, 25] })
  } else if (medium === 'music') {
    return L.icon({ iconUrl: green_button, iconSize: [25, 25] })
  }
}

const customMarker = L.icon({ iconUrl: pink_button, iconSize: [25, 25] })
const TestPopupMarker = ({ eventName, eventOrganizer, venueName, streetAddress, city, state, latitude, longitude, medium, latlng, userLocation }) => (
   <Marker icon={customMarker} position={[latitude, longitude]}>
     <script>{console.log('user location ---------------->', userLocation)} </script>

     {/* ////////////////////////////// THIS //////////////////////////////// */}
     <script>{ splitUserLoc = userLocation.split(' ').join('+') } </script>

     <Popup>
       <b>{eventName}</b><br/>
       <b>{venueName}</b><br/>
       Address: {streetAddress + ', '+ city}<br/>
{/* https://www.google.com/maps/dir/SFO,+San+Francisco,+CA/AMC+Van+Ness+14,+Van+Ness+Avenue,+San+Francisco,+CA/@37.6957396,-122.4952311,12z/ */}

      <Form action={"https://www.google.com/maps/dir/"+ latitude + "," + longitude + '/' + splitUserLoc +"/@" + latlng.lat + ',' + latlng.lng  +',15z'}><Button size='mini'>Take Me There</Button><Button size='mini'>More</Button></Form>
     </Popup>
   </Marker>
 )

const TestMarkerList = ({ data, latlng, userLocation }) => {
  const items = data.map(({ _id, ...props}) => (
    <TestPopupMarker userLocation={userLocation} latlng={latlng} key={_id} {...props}></TestPopupMarker>
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

export default class MainMap extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      // for event sorting on the map
        filterArt: true,
        filterMusic: true,
        filterPerf: true,

      // for displaying all of the different places
        hasLocation: false,
        searchingPlace: null,
        latlng: props.latlon ? {lat: props.latlon.lat, lon: props.latlon.lon} : {lat:37.771887, lon: -122.409596},
      // latlng: {this.props.latlon},
        viewport: {
          center: [51.505, -0.09],
          // center: [this.props.latlon.lat, this.props.latlon.lon],
          zoom: 13
        },
        medium: null,

        data: [],

        userLocation: ''
      }
  }


  componentDidMount() {

    this.mapRef.current.leafletElement.locate()

    fetch(url+'/events', {
      method: 'GET',
    }).then(res => res.json())
    .then(json => {
      let data_use = []
      console.log(json[1])
      // console.log(json.[1].latitude)
      for(var i=0; i<json.length; i++) {
        if(json[i].latitude && json[i].longitude) {
          json[i].latitude = parseFloat(json[i].latitude)
          json[i].longitude = parseFloat(json[i].longitude)
          data_use.push(json[i])
        }
      }

      console.log('filtered data ', data_use)

      this.setState({
        data: data_use
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  onSearchChange = (event) => {
    this.setState({
      searchingPlace: event.target.value
    })
  }

  findPlace = () => {
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

/// NOT DONE
  //   geocoderReverse.reverseGeocode( parseFloat(this.state.latlng.lat), parseFloat(this.state.latlng.lon), function( err, response) {
  //     if(err) {
  //       console.log( parseFloat(this.state.latlng.lat))
  //
  //       console.log('threw an error, ', err)
  //     } else {
  //       var address = response.results[0].formatted_address
  //       var address = address.split(',')
  //       address = address[0] + ',' + address[1]
  //
  //       this.setState({
  //         userLocation: address
  //       })
  //       console.log('did the thing, ', response)
  //     }
  //   }
  // )

  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// if more clicked

  // more = () => {
  //   <Grid.Column>
  //     <Grid.Row><Segment></Segment></Grid.Row>
  //   </Grid.Column>
  // }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// render the map interface
  render() {
    // locate present user on the map
    const marker = this.state.hasLocation ? (
      <CircleMarker center={this.state.latlng} radius={10}>
        <Popup>
          filterData=filterData.filter(item => item.about !== "music")
          <span>You are here</span>
        </Popup>
      </CircleMarker>
    ) : null

    // copy data
    let filterData = this.state.data.slice()
    if(this.state.filterArt===false){
      filterData=filterData.filter(item => item.about !== "art")
    }
    if(this.state.filterMusic===false){
    }
    if(this.state.filterPerf===false){
      filterData=filterData.filter(item => item.about !== "performance")
    }

    return (
      <Grid >
        <Grid.Column floated='bottom-right'>
          <Grid.Row>
            <Input focus className="placeSearch" placeholder="Find a place..." onChange={this.onSearchChange}/>
            <Button onClick={this.findPlace}>Search</Button>
          </Grid.Row>
          <Grid.Row><Button onClick={this.handleClick}>Find Me</Button></Grid.Row>
          <Grid.Row>
            <Button.Group>
              <Button active = {this.state.filterArt ? true : false } onClick={(e) => { this.setState({filterArt: !this.state.filterArt}); }}>Visual Arts</Button>
              <Button  active = {this.state.filterMusic ? true : false  }  onClick={(e) => { this.setState({filterMusic: !this.state.filterMusic}); }}>Music</Button>
              <Button active = {this.state.filterPerf ? true : false }  onClick={(e) => { this.setState({filterPerf: !this.state.filterPerf}); }}>Performance</Button>
            </Button.Group>
          </Grid.Row>
          <Grid.Row>
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
                <TestMarkerList data={filterData} latlng={this.state.latlng} userLocation={this.state.userLocation}/>

                {/* past map tile of interest -- kept for reference */}

                {/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                  // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                  id: 'mapbox.comic',
                  accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
                }).addTo(this.map); */}
                {marker}
              </Map>
            </Grid.Row>
        </Grid.Column>
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
