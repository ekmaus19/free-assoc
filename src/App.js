import React, { Component } from 'react';
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
import {Button, Icon, Input, Menu, Image,Container} from 'semantic-ui-react';
import io from 'socket.io-client';
import url from './components/backend'
const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim({
  secure: true
})

console.log(url)

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
      isArtist: false,
      placeSearch: null,
      placeSearchCoords: {
        lat: null,
        lon: null,
      }
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

onNameChange = (e) => {
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
       <Menu className="menu" size='large' style={{justifyContent:'space-between'}}>
              {/* <div style={{width:'10%', height:'3%', marginLeft:'20px',marginRight:'20px', marginTop:'10px'}}>
                 <Image src='/img/font.png' />
             </div> */}
             <Container >
              <Menu.Item>
                      <header style={{marginRight:'auto', height:'20px'}} className="App-header">
                        <Image width='30px' height='30px' src='/img/logo4.png'/>

                       </header>
                    <h2 style={{marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>  Free Associations  </h2>
                </Menu.Item>
                <Menu.Item onClick = {() => this.redirect('Home')} as='a' active>Home</Menu.Item>
                <Menu.Item onClick = {() => this.redirect('Ethos')} as='a'>Ethos</Menu.Item>
                <Menu.Item onClick= {() => this.redirect('About')}as='a'>About</Menu.Item>
                <Menu.Item as='a'>Careers</Menu.Item>
                </Container>
                <Container style={{display:'flex',justifyContent:'flex-end'}}>
                <Button style={{padding:'3px',height:'75%',width:'100px', textAlign:'center', margin:'10px'}} basic color = 'grey' className = "register-button"  animated onClick = {() => this.redirect('Registerpicker')}>Register</Button>
                <Button style={{padding:'3px',width:'100px',height:'75%', textAlign:'center', margin:'10px'}} color = 'violet' className = "login-button"  animated onClick = {() => this.redirect('Login')}>Login</Button>
                </Container>
            </Menu>

         {this.state.currentPage === 'Home' ?
          <div>
             <div style={{width:'30%', height:'30%',alignItems:'center',justifyContent:'center', marginLeft:'auto',marginRight:'auto', marginTop:'40px'}}>
             <Image className="mainlogo" src='/img/font2.png'/>
             {/* <h1 className='App-logo'>AMP</h1> */}

            </div>

          <div>
            {/* <Input size='massive' action={{icon:'search'}} onChange = {this.onNameChange}  className = "field" placeholder = "Events Near Me"/> */}
            <Button style={{padding:'3px',textAlign:'center',width:'450px',height:"60px", fontSize:'30px'}} color='orange' onClick = { () => { this.nearMeRedirect()}}> Events   Near   Me</Button>
            <br/>
            <h2>or</h2>
            <Input style={{width:'450px',height:"60px", textAlign:'center', marginBottom:'50px'}} size='massive' onChange = {this.onNameChange} className = "field" placeholder = "Search a place..."/>
            <Button color='violet' style={{width:'100px',height:"40px",textAlign:'center', display:'block', marginRight:'auto', marginLeft:'auto'}} onClick = {this.searchPlaceHome}>Go!</Button>
            <br />
          </div>
          <br/>
          {/* <Button color = 'blue' className = "register-button"  animated onClick = {() => this.redirect('Registerpicker')}>
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
          </Button> */}

          </div>: null}
          {this.state.currentPage === 'Ethos' ? <div><Ethos/></div>:null}
          {this.state.currentPage === 'About' ? <div><About/></div>:null}
          {this.state.currentPage === 'Login' ? <div><LoginScreen onLogin={this.onLogin} artistInfo={(obj)=>this.setState({artist:obj})} redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'Registerpicker' ? <div><RegisterScreenPicker redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterUser' ? <div><RegisterScreen redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterArtist' ? <div><RegisterArtist redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'ArtistDash' ? <div><ArtistDash socket={this.socket} artist={this.state.artist} isArtist={this.state.isArtist} redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'MainMap' ? <div><MainMap latlon={this.state.placeSearchCoords} isArtist = {this.state.isArtist} redirect={(e) => this.redirect(e)}/></div> : null}
      </div>
    );
  }
}

export default App;
