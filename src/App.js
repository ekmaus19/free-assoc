import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginScreen from './components/Login';
import RegisterScreenPicker from './components/RegisterPicker';
import RegisterScreen from './components/Register';
import RegisterArtist from './components/RegisterArtist';
import ArtistDash from './components/ArtistDash';
import {CreateEvent} from './components/CreateEvent';
import About from './components/About';
import Ethos from './components/Ethos';
import MainMap from './components/Map';
import {Button, Icon, Input, Menu, Image} from 'semantic-ui-react';
import io from 'socket.io-client';
import url from './components/backend'

<<<<<<< HEAD
const url = 'http://1c65b18b.ngrok.io'
=======
const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim()
>>>>>>> f30a75ad04c0edbeef642421ac878ac33acda663

class App extends Component {
  constructor(props){
    super(props)
    this.socket = io(url)
    this.state = ({
      currentPage:'Home',
      artist:{},
      latlon: {
        lat: null,
        lon: null,
      },
      userId: '',
<<<<<<< HEAD
      event:{}
=======
      placeSearch: null,
      placeSearchCoords: {
        lat: null,
        lon: null,
      }
>>>>>>> f30a75ad04c0edbeef642421ac878ac33acda663
    })
  }

  componentWillUnmount() {
    this.setState({
      placeSearchCoords: {
        lat: null,
        lon: null,
      },
      placeSearch: null,
    })
  }
///test
  redirect(page){
    this.setState({
      currentPage: page,
    })
}

nearMeRedirect = () => {
  this.setState({
    placeSearchCoords: {
      lat: null,
      lon: null,
    },
    placeSearch: null,
  })
  this.redirect("MainMap")
}

onPassChange = (e) => {
  this.setState({
    placeSearch: e.target.value,
  })
}

searchPlaceHome = () => {
  geocoder.search({ q: this.state.placeSearch})
  .then((response)=> {
    this.setState({
      placeSearchCoords:{
        lat: response[0].lat,
        lon: response[0].lon,
      },
      currentPage: 'MainMap'
    })
    console.log("Home page state:", this.state)
  });
}



  render() {
    return (
      <div className="App">
       <Menu className="menu"
              size='large'>
              <div style={{width:'10%', height:'3%', marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
                 <Image src='/img/font.png' />
             </div>
                <Menu.Item onClick = {() => this.redirect('Home')} as='a' active>Home</Menu.Item>
                <Menu.Item onClick = {() => this.redirect('Ethos')} as='a'>Ethos</Menu.Item>
                <Menu.Item onClick= {()=>this.redirect('About')}as='a'>About</Menu.Item>
                <Menu.Item as='a'>Careers</Menu.Item>

                <Menu.Item position='right'>
                      <header style={{marginRight:'auto'}} className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                       </header>
                    <h2 style={{marginTop:'auto', marginBottom:'auto'}}>  Free Associations  </h2>
                </Menu.Item>

            </Menu>


         {this.state.currentPage === 'Home' ?
          <div>
          <div>
            {/* <Input size='massive' action={{icon:'search'}} onChange = {this.onNameChange}  className = "field" placeholder = "Events Near Me"/> */}
            <Button onClick = { () => { this.nearMeRedirect() } }>Events Near Me</Button>
            <br/>
            <h2>or</h2>
            <Input size='large' onChange = {this.onPassChange}  className = "field" placeholder = "Search a place..."/>
            <Button onClick={ this.searchPlaceHome }>Search</Button>
            <br />
          </div>
          <br/>
          <Button color = 'blue' className = "register-button"  animated onClick = {() => this.redirect('Registerpicker')}>
            <Button.Content visible>Register</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <Button color = 'pink' className = "login-button"  animated onClick = {() => this.redirect('Login')}>
            <Button.Content visible>Login</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>

          </div>: null}
          {this.state.currentPage === 'Ethos' ? <div><Ethos/></div>:null}
          {this.state.currentPage === 'About' ? <div><About/></div>:null}
          {this.state.currentPage === 'Login' ? <div><LoginScreen onLogin={this.onLogin} artistInfo={(obj)=>this.setState({artist:obj})} redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'Registerpicker' ? <div><RegisterScreenPicker redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterUser' ? <div><RegisterScreen redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterArtist' ? <div><RegisterArtist redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'ArtistDash' ? <div><ArtistDash socket={this.socket} event={this.state.event} artist={this.state.artist} redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'MainMap' ? <div><MainMap latlon={this.state.placeSearchCoords} socket={this.socket} redirect={(e) => this.redirect(e)}/></div> : null}

      </div>
    );
  }
}

export default App;
