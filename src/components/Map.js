import React, { createRef, Component } from 'react'
import { Map, TileLayer, Marker, Popup, CircleMarker, MapControl, ZoomControl } from 'react-leaflet'
import { Button, Input, Grid, Segment, Form, Dimmer, Loader } from 'semantic-ui-react'
import url from './backend'
import L from 'leaflet'
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
// import { Sidebar, Tab } from './Sidebar';

import '../index.css'

// ultimately, geocoder will be in the backend. In front for testing purposes
const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim()

var geocoderReverse = require('geocoder'); /// boooooooooooooo


/////
// const GeoCoder = require('reverse-geocoding')
// const betterReverse = new GeoCoder();

// var geocoding = new require('reverse-geocoding');

/////

const findMe = {
  center: [51.505, -0.09],
  zoom: 13
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// popup work

const pink_button = "https://webiconspng.com/wp-content/uploads/2017/09/Clothes-Button-PNG-Image-12924.png"
const blue_button = "http://purepng.com/public/uploads/large/purepng.com-blue-sewing-button-with-4-holecloth-buttonspatternsewingsewing-accessoriesclip-artblue-1421526305532cwfxq.png"
const green_button = "http://purepng.com/public/uploads/large/purepng.com-greent-round-buttoncloth-buttonspatternsewingsewing-accessoriesgreenclipart-14215263044871jstt.png"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let splitUserLoc
/////// 8.8.2018 WPS

const TestPopupMarker = ({ eventName, eventOrganizer, venueName, streetAddress, city, state, latitude, longitude, medium, latlng, userLocation, tags, about, menuClickPopup }) => {
let customMarker
console.log(medium, latitude, longitude)
  // if(medium === "art"){
  //      customMarker = L.icon({ iconUrl: blue_button, iconSize: [25, 25] })
  //   } else if (medium === 'performance') {
  //       customMarker =  L.icon({ iconUrl: pink_button, iconSize: [25, 25] })
  //   } else if (medium === 'music') {
  //      customMarker =  L.icon({ iconUrl: green_button, iconSize: [25, 25] })
  //   } else {
  //     customMarker =  L.icon({ iconUrl: "http://cdn.shopify.com/s/files/1/1211/8882/products/Stupid_Morty_WEB_grande.jpg?v=1503605262", iconSize: [25, 25] })
  //   }

  if(medium === "art"){
       customMarker = "#0060fc"
    } else if (medium === 'performance') {
        customMarker =  "#fc00b4"
    } else if (medium === 'music') {
       customMarker =  "#00fc2e"
    } else {
      customMarker =  "#d6a74a"
    }

// if <Marker />, use icon={customMarker}
  return ( <CircleMarker color={null} fillColor={customMarker} fillOpacity={.75} center={[latitude, longitude]} radius={12}>
     <script>{console.log('user location ---------------->', userLocation)} </script>

     {/* ////////////////////////////// THIS //////////////////////////////// */}
     <script>{ splitUserLoc = userLocation.split(' ').join('+') } </script>

     <Popup>
       <b className="eventName">{eventName}</b><br/>
       <b>{venueName}</b><br/>
       Address: {streetAddress + ', '+ city}
       <br/>
{/* https://www.google.com/maps/dir/SFO,+San+Francisco,+CA/AMC+Van+Ness+14,+Van+Ness+Avenue,+San+Francisco,+CA/@37.6957396,-122.4952311,12z/ */}
{/* <Form action={window.open("https://www.google.com/maps/dir/"+ latitude + "," + longitude + "/" + splitUserLoc +"/@" + latlng.lat + "," + latlng.lng  + ",15z", "_blank")}><Button size='mini'>Take Me There</Button><Button size='mini'>More</Button></Form> */}

      <Button onClick={"https://www.google.com/maps/@" + latitude + ',' + longitude + ',15z'} size='mini'>Take Me There</Button><Button size='mini' onClick ={() => menuClickPopup(eventName, medium, eventOrganizer, venueName, streetAddress, city, state, latitude, longitude, tags, about)}>More</Button>
     </Popup>
   </CircleMarker>)
}

const TestMarkerList = ({ data, latlng, userLocation, menuClickPopup }) => {
  const items = data.map(({ _id, ...props}) => (
    <TestPopupMarker userLocation={userLocation} latlng={latlng} key={_id} {...props} menuClickPopup= {(event, medium, artist, venue, address, city, state, lat, long, tags, about) => menuClickPopup(event, medium, artist, venue, address, city, state, lat, long, tags, about)}></TestPopupMarker>
  ))
  return <div style={{ display: 'none' }}>{items}</div>
}

export default class MainMap extends Component {
  constructor(props) {

    super(props);
    this.state = {
      loading:true,
      // when more button clicked/////////////////////////
      moreClicked: false,
      menuEvent: null,
      menuMedium: null,
      menuArtist: null,
      menuVenue: null,
      menuAddress: null,
      menuCity: null,
      menuState: null,
      menuTags: null,
      menuAbout: null,

      // for event sorting on the map ////////////////////
      searchingPlace: null,
      filterMusic: true,
      filterPerf: true,
      filterArt: true,

      // for displaying all of the different places //////
      hasLocation: false,

      // main user map set up
      latlng: props.latlon ? {lat: props.latlon.lat, lon: props.latlon.lon} : {lat:27.773056, lon: -82.639999},
      viewport: {
        center: [51.505, -0.09],
        zoom: 13
      },
      medium: null,

      // data generation //////////////////////////////////
      data: [],

      // if a city was selected on the home page //////////
      cityLatLong: props.latlon ? true : false,

      userLocation: '',

      // sidebar to be used on the map ////////////////////
      collapsed: true,
      selected: null,

      // user or artist view //////////////////////////////
      artist: props.isArtist ? true : false

    }
  }


  componentDidMount() {
    fetch(url+'/events', {
      method: 'GET',
    }).then(res => res.json())
    .then(async json => {
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

      if(this.state.artist) {
        await this.mapRef.current.leafletElement.locate()
        this.setState({
          data: data_use,
          loading:false,
        })
      } else if(!this.props.latlon.lat) {
        console.log('in 1st choice, near me search')
        await this.mapRef.current.leafletElement.locate()
        this.setState({
          data: data_use,
          loading:false,
        })
      } else {
        console.log('in else statement')
        this.setState({
          viewport: {
            center: [this.props.latlon.lat, this.props.latlon.lon]
          },
        })
      }

  }).catch((err) => {
      console.log(err)
    })
    console.log("Map view:", this.state)
    this.mapRef.current.leafletElement.locate()
  }
  data: data_use

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
    //user is here
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
      viewport: {
        center: e.latlng,
      },
      //     // var address = address.split(',')
    })
    // first try

    // geocoderReverse.reverseGeocode( parseFloat(e.latlng.lat), parseFloat(e.latlng.lng), function( err, response) {
    //     console.log(parseFloat(e.latlng.lat))
    //     console.log(parseFloat(e.latlng.lng))
    //
    //     console.log('threw an error, ', err)
    //   } else {
    //     console.log(response)

    //     // var address = response.results[0].formatted_address
    //     // address = address[0] + ',' + address[1]
    //     var address = "test"
    //   if(err) {
    //     this.setState({
    //       userLocation: address
    //     })
    //     console.log('did the thing, ', response)
    //   }
    // })

 // different try

    // var config = {
    //     'latitude': parseFloat(e.latlng.lat),
    //     'longitude': parseFloat(e.latlng.lng)
    // };
    // geocoding.location(config, function (err, data){
    //     if(err){
    //           console.log('threw an error, ', err)
    //     }else{
    //         console.log(data);
    //     }
    // });
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



 menuClickPopup = (event, medium, artist, venue, address, city, state, lat, long, tags, about) => {
  console.log('hit me baby one more time')
  console.log("params -----------> ", event, medium, artist, venue, address, city, state)
    this.setState({
      moreClicked: true,
      menuEvent: event,
      menuMedium: medium,
      menuArtist: artist,
      menuVenue: venue,
      menuAddress: address,
      menuCity: city,
      menuState: state,
      menuTags: tags,
      menuAbout: about,

      viewport: {
        zoom: 14,
        center: [lat-.005, long-.025],
      },

      collapsed: false,
      selected: 'event',
    })
  }

  handleClickWTF = (items) => {
    var item = items[Math.floor(Math.random()*items.length)];
    console.log("WHAT THE ACTUAL ", item)
    this.menuClickPopup(item.eventName, item.medium, item.artist, item.venueName, item.streetAddress, item.city, item.state, item.latitude, item.longitude, item.tags, item.about)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // sidebar code
  onSidebarClose() {
    this.setState({collapsed: true});
  }
  onSidebarOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// render the map interface
  render() {
    console.log(this.state)
    // locate present user on the map
    const marker = this.state.hasLocation ? (
      <CircleMarker center={this.state.latlng} radius={10}>
        <Popup>
          <span>You are here</span>
        </Popup>

      </CircleMarker>
    ) : null

    // copy data and allow the buttons to filter the map
    let filterData = this.state.data.slice()
    if(this.state.filterArt===false){
      filterData=filterData.filter(item => item.medium !== "art")
    }
    if(this.state.filterMusic===false){
      filterData=filterData.filter(item => item.medium !== "music")

    }
    if(this.state.filterPerf===false){
      filterData=filterData.filter(item => item.medium !== "performance")
    }

    const menuSingleEvent = this.state.moreClicked ? (
        <div className="menuSingleEvent">
          <br/>
          <p className="listingL2"><b>Artist:</b> {this.state.menuArtist}</p>
          <p>{this.state.menuArtist}</p>
          <p><b className="listingVenueName">{this.state.menuVenue}</b> {this.state.menuAddress}, {this.state.menuState}</p>
          <p><b>About: </b>{this.state.menuAbout}</p>
      </div>
    ) : <Tab><p></p></Tab>

    const mapComponent = (<Map className="sidebar-map"
                    // onClick={this.setState({collapsed:true})}
                    center={this.state.latlng}
                    length={4}
                    onLocationfound={this.handleLocationFound}
                    ref={this.mapRef}
                    // zoom={15}
                    viewport={this.state.viewport}
                    zoomControl={false}>
                    <TileLayer
                      attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                      url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
                    />
                    <ZoomControl position="bottomright"/>
                    <TestMarkerList data={filterData} latlng={this.state.latlng} userLocation={this.state.userLocation} menuClickPopup={(event, medium, artist, venue, address, city, state, lat, long, tags, about)=>this.menuClickPopup(event, medium, artist, venue, address, city, state, lat, long, tags, about)}/>

                    {/* past map tile of interest -- kept for reference */}
                    {/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                      // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                      id: 'mapbox.comic',
                      accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
                    }).addTo(this.map); */}
                    {marker}
                  </Map>
                )

    const mapLoading = (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
    )

    return (
      <Grid>
        <Grid.Column>
          {/* <Grid.Row>
            <Input focus className="placeSearch" placeholder="Find a place..." onChange={this.onSearchChange}/>
            <button  className={this.state.filterArt ? "buttonArt" : "buttonOff" } onClick={(e) => { this.setState({filterArt: !this.state.filterArt}); }}>A</button>
            <Button onClick={this.findPlace}>Search</Button>
          </Grid.Row> */}
          <Grid.Row><Button className="buttonFindMe" onClick={() => this.handleClick}>Find Me</Button></Grid.Row>
          <Grid.Row><Button className="buttonWTF" onClick={() => this.handleClickWTF(filterData ? filterData : this.state.data)}>WTF</Button></Grid.Row>

          <Grid.Row>
            {this.state.loading ? mapLoading : null }

            <div className='buttonMain'>
              <button className={this.state.filterArt ? "buttonArt" : "buttonOff" } onClick={(e) => { this.setState({filterArt: !this.state.filterArt}); }}>A</button>
              <button className={this.state.filterMusic ? "buttonArt" : "buttonOff" } onClick={(e) => { this.setState({filterMusic: !this.state.filterMusic}); }}>M</button>
              <button className={this.state.filterPerf ? "buttonArt" : "buttonOff" } onClick={(e) => { this.setState({filterPerf: !this.state.filterPerf}); }}>P</button>
            </div>
            {/* <button className='buttonArt'>Test CSS</button> */}
          </Grid.Row>
          <Grid.Row>
            <Sidebar id="sidebar" collapsed={this.state.collapsed} selected={this.state.selected}
                     onOpen={this.onSidebarOpen.bind(this)} onClose={this.onSidebarClose.bind(this)}>
              <Tab id="home1" header="Find a Place" icon="fa fa-globe">
              <br/>
                <Input focus action="Search" className="placeSearch" placeholder="Find a place..." onChange={this.onSearchChange} onClick={this.findPlace}/>
                {/* <Input focus className="placeSearch" placeholder="Find a place..." onChange={this.onSearchChange}/><Button onClick={this.findPlace}>Search</Button> */}
              </Tab>
              <Tab id="event" header={this.state.menuEvent} icon="fa fa-info-circle">
                {menuSingleEvent}
              </Tab>
              <Tab id="music" placeholder="M" icon="fa fa-meh-o"></Tab>


            </Sidebar>
              {mapComponent}
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
