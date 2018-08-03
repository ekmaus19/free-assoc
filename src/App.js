import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginScreen from './components/Login';
import RegisterScreenPicker from './components/RegisterPicker';
import RegisterScreen from './components/Register';
import RegisterArtist from './components/RegisterArtist';
import ArtistDash from './components/ArtistDash';
import {Button, Icon, Input, Menu, Container} from 'semantic-ui-react';
import io from 'socket.io-client'

const url = 'http://7dda4690.ngrok.io'

class App extends Component {
  constructor(props){
    super(props)
    this.socket = io(url)
    this.state=({
      currentPage:'Home',
      artist:{},
    })
  }

  redirect(page){
    this.setState({
      currentPage: page
    })
}

  

  render() {

    return (
      <div className="App">
       <Menu className="menu"
              size='large'
            >

                <Menu.Item as='a' active>Home</Menu.Item>
                <Menu.Item as='a'>Ethos</Menu.Item>
                <Menu.Item as='a'>About</Menu.Item>
                <Menu.Item as='a'>Careers</Menu.Item>
                <Menu.Item position='right'>
                    <h2> Free Associations  </h2>
                </Menu.Item>
        
            </Menu>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1 className="App-title">AMP</h1>
         {this.state.currentPage === 'Home' ?
          <div> 
          <div>
            <Input size='massive' action={{icon:'search'}} onChange = {this.onNameChange}  className = "field" placeholder = "Events Near Me"/>
            <br/>
            <h2>or</h2>
            <Input size='massive' action='GO!' onChange = {this.onPassChange}  className = "field" placeholder = "...City Name"/>
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
          {this.state.currentPage === 'Login' ? <div><LoginScreen onLogin={this.onLogin} artistInfo={(obj)=>this.setState({artist:obj})} redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'Registerpicker' ? <div><RegisterScreenPicker redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterUser' ? <div><RegisterScreen redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'RegisterArtist' ? <div><RegisterArtist redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'ArtistDash' ? <div><ArtistDash socket={this.socket} artist={this.state.artist} redirect={(e) => this.redirect(e)}/></div> : null} 
      </div>
    );
  }
}

export default App;
