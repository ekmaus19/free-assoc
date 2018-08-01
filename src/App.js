import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginScreen from './components/Login';
import RegisterScreen from './components/Register';
import {Button, Icon, Input} from 'semantic-ui-react';



class App extends Component {
  constructor(props){
    super(props)
    this.state=({
      currentPage:'Home',
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1 className="App-title">Free Associations</h1>
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
          <Button color = 'green' className = "register-button"  animated onClick = {() => this.redirect('Register')}>
            <Button.Content visible>Register</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <Button color = 'grey' className = "login-button"  animated onClick = {() => this.redirect('Login')}>
            <Button.Content visible>Login</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
         
          </div>: null}
          {this.state.currentPage === 'Login' ? <div><LoginScreen onLogin={this.onLogin}  redirect={(e) => this.redirect(e)}/></div> : null}
          {this.state.currentPage === 'Register' ? <div><RegisterScreen redirect={(e) => this.redirect(e)}/></div> : null}

      </div>
    );
  }
}

export default App;
