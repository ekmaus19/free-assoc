import React, {Component} from 'react';
import {Button, Icon, Input} from 'semantic-ui-react';
import validator from 'validator';

const url = 'http://localhost:1337'

const required = (value) => {
  if (!value.toString().trim().length) {
    return 'required';
  }
};

const email = (value) => {
  if (!validator.isEmail(value)) {
    return 'enter a valid email address'
  }
};

class RegisterScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      password: '',
      email:'',
      passwordRepeat:''
    }
  }

  onNameChange = (event) =>{
    this.setState({
      name: event.target.value
    })
  }

  onEmailChange = (event) =>{
    this.setState({
      email: event.target.value
    })
  }

  onPassChange = (event) =>{
    this.setState({
      password: event.target.value
    })
  }

  onConfirmChange = (event) =>{
    this.setState({
      passwordRepeat: event.target.value
    })
  }

  onRegister = () => {
    fetch(url + '/register/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.name,
        email: this.state.email,
        password: this.state.password,
        passwordRepeat: this.state.passwordRepeat
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.props.redirect('Login')
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    return (
      <div>
        <div>
        <Input onChange = {this.onNameChange} className = "field" placeholder = "Username" validations={[required]}/>
        <br />
        <Input onChange = {this.onEmailChange} className = "field" placeholder = "Email" validations={[required, email]}/>
        <br />
        <Input onChange = {this.onPassChange} className = "field" placeholder = "Password" validations={[required]}/>
        <br />
        <Input onChange = {this.onConfirmChange} className = "field" placeholder = "Confirm Password" validations={[required]}/>
        </div>
        <br />
        <Button color = 'green' className = "register-button"  animated onClick={this.onRegister}>
            <Button.Content visible>Register</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
      </div>

    );
  }
}
export default RegisterScreen;
