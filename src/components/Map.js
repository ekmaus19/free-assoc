import React, { createRef, Component } from 'react'
import { Map, TileLayer, Marker, Popup, CircleMarker, MapControl, ZoomControl } from 'react-leaflet'
import { Button, Input, Grid, Segment, Form, Dimmer, Loader } from 'semantic-ui-react'
import url from './backend'
import L from 'leaflet'
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import {
    TimeInput,
    DateInput,
    DatesRangeInput,
    DateTimeInput,
  } from 'semantic-ui-calendar-react';
import moment from 'moment';
import '../index.css'

moment().format();
// import { Sidebar, Tab } from './Sidebar';


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
     {/* <script>{console.log('user location ---------------->', userLocation)} </script> */}

     {/* ////////////////////////////// THIS //////////////////////////////// */}
     {/* <script>{ splitUserLoc = userLocation.split(' ').join('+') } </script> */}

     <Popup>
       <b className="eventName">{eventName}</b><br/>
       <b>{venueName}</b><br/>
       Address: {streetAddress + ', '+ city}
       <br/>
{/* https://www.google.com/maps/dir/SFO,+San+Francisco,+CA/AMC+Van+Ness+14,+Van+Ness+Avenue,+San+Francisco,+CA/@37.6957396,-122.4952311,12z/ */}
{/* <Form action={window.open("https://www.google.com/maps/dir/"+ latitude + "," + longitude + "/" + splitUserLoc +"/@" + latlng.lat + "," + latlng.lng  + ",15z", "_blank")}><Button size='mini'>Take Me There</Button><Button size='mini'>More</Button></Form> */}

      <Button onClick={"https://www.google.com/maps/@" + userLocation + '/'+ latitude + ',' + longitude + ',15z'} size='mini'>Take Me There</Button><Button size='mini' onClick ={() => menuClickPopup(eventName, medium, eventOrganizer, venueName, streetAddress, city, state, latitude, longitude, tags, about)}>More</Button>
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
      nowTime: null,
      nowHourTime: null,
      instantGratification: false,
      future: false,
      date: '',
      // if a city was selected on the home page //////////
      cityLatLong: props.latlon ? true : false,

      userLocation: {
        lat:27.773056,
        lon: -82.639999
      },
      userAddress: null,

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

      var currDate = moment().format('YYYY-MM-DD');
      var currTime = moment().format("HH:mm")
      console.log(currDate)
      // currDate = moment(String(currDate))
      // console.log("TESTING DATE ", currDate)


      console.log(json[1])
      for(var i=0; i<json.length; i++) {
        if(json[i].latitude && json[i].longitude && json[i].datesRange) {
          json[i].latitude = parseFloat(json[i].latitude)
          json[i].longitude = parseFloat(json[i].longitude)
          data_use.push(json[i])
        }
      }

      /// fix the date format
      for(var i=0; i < data_use.length; i++) {
        data_use[i].datesRange = data_use[i].datesRange.split(' - ');
        var one = String(data_use[i].datesRange[0])
        console.log(moment(one, "DD-MM-YYYY").format('YYYY-MM-DD'))
        var two = String(data_use[i].datesRange[1])
        console.log(moment(two, "DD-MM-YYYY").format('YYYY-MM-DD'))
        data_use[i].datesRange[0] = moment(one, "DD-MM-YYYY").format('YYYY-MM-DD');
        data_use[i].datesRange[1] = moment(two, "DD-MM-YYYY").format('YYYY-MM-DD');
      }
      console.log(data_use)

      if(this.state.artist) {
        await this.mapRef.current.leafletElement.locate()
        console.log(this.mapRef.current.leafletElement.locate())
        this.setState({
          data: data_use,
          loading:false,
          nowTime: currDate,
          nowHourTime: currTime,
          userLocation: {
            lat: a._lastCenter.lat,
            lon: a._lastCenter.lng,
          },
        })
      } else if(!this.props.latlon.lat) {
        await this.mapRef.current.leafletElement.locate()
        var a = await this.mapRef.current.leafletElement.locate()
        this.setState({
          data: data_use,
          loading:false,
          nowTime: currDate,
          nowHourTime: currTime,
          userLocation: {
            lat: a._lastCenter.lat,
            lon: a._lastCenter.lng,
          },
        })
        console.log('in 1st choice, near me search')
      } else {
        console.log('in else statement')
        this.setState({
          viewport: {
            center: [this.props.latlon.lat, this.props.latlon.lon]
          },
          nowTime: currDate,
          nowHourTime: currTime,
        })
      }
  }).catch((err) => {
      console.log(err)
    })
    console.log("Map view:", this.state)
    // this.mapRef.current.leafletElement.locate()
  }
  data: data_use

////////////////////////////////////////////////////////////////////////////////

  onSearchChange = (event) => {
    this.setState({
      searchingPlace: event.target.value
    })
  }

  handleDateChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleTimeChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  //////////////////////////////////////////////////////////////////////////////

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
    var a = this.mapRef.current.leafletElement.locate()
    this.setState({
      viewport: {
        center: [ a._lastCenter.lat, a._lastCenter.lng],
        zoom: 14,
      }
    })
    console.log(this.state.viewport)
  }

  handleLocationFound = e => {
    //user is here
    this.setState({
      hasLocation: true,
      userLocation: e.latlng,
      //     console.log(parseFloat(e.latlng.lat))
      latlng: e.latlng,
      viewport: {
        center: e.latlng,
      },
      //     // var address = address.split(',')
    })
    // first try

    // geocoderReverse.reverseGeocode( parseFloat(e.latlng.lat), parseFloat(e.latlng.lng), function( err, response) {
    //   if(err){
    //     console.log(parseFloat(e.latlng.lng))
    //     console.log('threw an error, ', err)
    //   } else {
    //     console.log(response)
    //     var address = response.results[0].formatted_address
    //     console.log(address)
    //     address = address[0] + ',' + address[1]
    //
    //     this.setState({
    //       userAddress: address
    //     })
    //     console.log('did the thing, ', response)
    //   }
    // })

 // different try

    // var config = {
    //     'latitude': parseFloat(e.latlng.lat),
    //     'longitude': parseFloat(e.latlng.lng)
    // };
    //     if(err){
    //           console.log('threw an error, ', err)
    //     }else{
    //         console.log(data);
    //     }
    // });
  }

  // geocoding.location(config, function (err, data){
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
    console.log("WHAT THE ACTUAL ", item)
    var item = items[Math.floor(Math.random()*items.length)];
    this.menuClickPopup(item.eventName, item.medium, item.artist, item.venueName, item.streetAddress, item.city, item.state, item.latitude, item.longitude, item.tags, item.about)

    return <CircleMarker fillColor={"red"} center={[item.latitude, item.longitude]} radius={.5}>
      <Popup>
        <b className="eventName">{item.eventName}</b><br/>
        <b>{item.venueName}</b><br/>
        Address: {item.streetAddress + ', '+ item.city}
        <br/>
       {/* <Button onClick={"https://www.google.com/maps/@" + item.latitude + ',' + item.longitude + ',15z'} size='mini'>Take Me There</Button><Button size='mini' onClick ={() => menuClickPopup(eventName, medium, eventOrganizer, venueName, streetAddress, city, state, latitude, longitude, tags, about)}>More</Button> */}
      </Popup>
    </CircleMarker>
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

  onNowTime = () => {
    var now = moment();
    var now_time = moment().format("HH:mm")
    console.log("Right now ", now_time);
    this.setState({
      nowHourTime: now_time,
      instantGratification: true,
      future: false,
    })
  }

  onSoonTime = () => {
    var inAnHour = moment().add(1, 'hour').format("HH:mm")
    console.log("in an hour", inAnHour)
    this.setState({
      nowHourTime: inAnHour,
    })
  }

  onTodayTime = () => {
    var currDate = moment().format('YYYY-MM-DD');
    var currTime = moment().format("HH:mm")
    this.setState({
      nowTime: currDate,
      nowHourTime: currTime,
      instantGratification: false,
      future: false,
    })
    console.log(this.state.nowTime)
  }

  handleSomeChange = (event, {name, value}) => {
    console.log("event,", event, "; name,", name, "; value,",value)
     if (this.state.hasOwnProperty(name)) {
       var newDate = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD")
       this.setState({ [name]: value,
         nowTime: newDate,
         instantGratification: false,
         future: true,
        });
     }
   }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

/// figure out the event times: display events happening right now vs events happening later today

    if(this.state.instantGratification) {
      if(this.state.nowHourTime && this.state.nowTime) {
        let dud = []
        // find events that are happening right now!!
        // if the current timetime is less than the end time of event AND AFTER start time
        for(var i=0; i<filterData.length; i++) {
          console.log(String(this.state.nowTime))
          console.log(filterData[i].datesRange)
          if(filterData[i].datesRange.indexOf(String(this.state.nowTime)) !== -1) {
            if(filterData[i].startTime <= this.state.nowHourTime < filterData[i].endTime) {
              dud.push(filterData[i])
              console.log('Event happening RIGHT NOW')
            } else {
              console.log("Event was today, but is not in the range", filterData[i].time, filterData[i].startTime, filterData[i].endTime)
            }
          } else {
            console.log('event not happening today', filterData[i].time, filterData[i].startTime, filterData[i].endTime)
          }
        }
        filterData=dud
        console.log("All of these should show up >>>>>>>>>>>>>", dud)
      }
    } else if (this.state.future) {
        let dud = []
        // find events that are happening right now!!
        // if the current timetime is less than the end time of event AND AFTER start time
        for(var i=0; i<filterData.length; i++) {
          console.log(String(this.state.nowTime))
          console.log(filterData[i].datesRange)
          if(filterData[i].datesRange.indexOf(String(this.state.nowTime)) !== -1) {
            dud.push(filterData[i])
          } else {
            console.log('event not happening today', filterData[i].time, filterData[i].startTime, filterData[i].endTime)
          }
        }
        filterData=dud
        console.log("Future dates that should be rendered", dud)
    } else {
      if(this.state.nowHourTime && this.state.nowTime) {
        let dud = []
        // find events that are happening right now!!
        // if the current timetime is less than the end time of event AND AFTER start time
        for(var i=0; i<filterData.length; i++) {
          console.log(String(this.state.nowTime))
          console.log(filterData[i].datesRange)
          if(filterData[i].datesRange.indexOf(String(this.state.nowTime)) !== -1) {
            if(this.state.nowHourTime < filterData[i].endTime) {
              dud.push(filterData[i])
              console.log('today and still to happen')
            } else {
              console.log("today but already happened")
            }
          } else {
            console.log('not today')
          }
        }
        filterData=dud
        console.log("All of these should show up >>>>>>>>>>>>>", dud)
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // filter through music / arts / performances

    if(this.state.filterArt===false){
      filterData=filterData.filter(item => item.medium !== "art")
    }
    if(this.state.filterMusic===false){
      filterData=filterData.filter(item => item.medium !== "music")

    }
    if(this.state.filterPerf===false){
      filterData=filterData.filter(item => item.medium !== "performance")
    }

/// side menu tab template

    const menuSingleEvent = this.state.moreClicked ? (
        <div className="menuSingleEvent">
          <br/>
          <p className="listingL2"><b>Artist:</b> {this.state.menuArtist}</p>
          <p>{this.state.menuArtist}</p>
          <p><b className="listingVenueName">{this.state.menuVenue}</b> {this.state.menuAddress}, {this.state.menuState}</p>
          <p><b>About: </b>{this.state.menuAbout}</p>
      </div>
    ) : <Tab><p></p></Tab>

// map constant

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
                    <TestMarkerList data={filterData} latlng={this.state.latlng} userLocation={this.state.userAddress} menuClickPopup={(event, medium, artist, venue, address, city, state, lat, long, tags, about)=>this.menuClickPopup(event, medium, artist, venue, address, city, state, lat, long, tags, about)}/>

                    {/* past map tile of interest -- kept for reference */}
                    {/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                      // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                      id: 'mapbox.comic',
                      accessToken: "pk.eyJ1IjoiZWttYXVzMTkiLCJhIjoiY2prYTAyc3JvMXppbjNrbWtmNTI5cmFheSJ9.SRlzG8UvBjRsNKoB1oY56Q"
                    }).addTo(this.map); */}
                    {marker}
                  </Map>
                )
// loading screen for main map

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
          <Grid.Row><Button className="buttonFindMe" onClick={() => this.handleClick()}>Find Me</Button></Grid.Row>
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
              <Tab id="music" placeholder="M" icon="fa fa-clock-o">
                <Button onClick={this.onNowTime}>Right Now</Button>
                {/* <Button onClick={this.onSoonTime}>Soon (+1hr)</Button> */}
                <Button onClick={this.onTodayTime}>Today</Button>
                <Form>
                  <div className='ui grid container'>
                    <div className='two wide column'>
                      <DateInput
                        inline
                        name="date"
                        value={this.state.date}
                        onChange={this.handleSomeChange} />
                    </div>
                  </div>
                </Form>
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
