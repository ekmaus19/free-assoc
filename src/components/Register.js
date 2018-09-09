import React, {Component} from 'react';
import {Button, Icon, Input, Image, Message} from 'semantic-ui-react';
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
      username: '',
      password: '',
      email:'',
      passwordRepeat:'',
      errors: [],
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
        console.log('user registered!!!!! ')
        this.props.redirect('Login')
      } else {

        // Getting list of Registeration Errors from Backend
        let errors = [];
        for (var error in responseJson) {
          errors.push(responseJson[error].msg);
        }
        this.setState({errors});
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  dismissErrors(){ this.setState({ errors: [] }) }

  render(){
    const errors = () => {
      if (this.state.errors.length > 0) {
        console.log(this.state.errors)
      return (
        <Message
          negative
          onDismiss={() => this.dismissErrors()}
          header='Registeration Errors'
          list={this.state.errors}
        />
        )
      }
    }

    return (
      <div>
        {errors()}
        <div>
        <Input onChange = {this.onNameChange} className = "field" placeholder = "Username" validations={[required]}/>
        <br />
        <Input onChange = {this.onEmailChange} className = "field" placeholder = "Email" validations={[required, email]}/>
        <br />
        <Input onChange = {this.onPassChange} type='password' className = "field" placeholder = "Password" validations={[required]}/>
        <br />
        <Input onChange = {this.onConfirmChange} type='password' className = "field" placeholder = "Confirm Password" validations={[required]}/>
        </div>
        <br />
        <Button color = 'yellow' className = "register-button"  animated onClick={this.onRegister}>
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
