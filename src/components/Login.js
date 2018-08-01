import React, {Component} from 'react';
import {Button, Icon, Input} from 'semantic-ui-react';
import {connect} from 'react-redux'

class LoginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      password: '',
    }
  }

  handleLogin =()=> {
    // this.props.onLogin(this.state.name, this.state.password)
    this.props.login()
  }

  onNameChange = (event) =>{
    this.setState({
      name: event.target.value
    })
  }

  onPassChange = (event) =>{
    this.setState({
      password: event.target.value
    })
  }

  render() {

    return (
      <div className = "login">
            {this.props.isLoggedin ? "logged in!": "not logged in"}
          <div className = "input-container">
            <Input onChange = {this.onNameChange}  className = "field" placeholder = "Username..."/>
            <br/>
            <Input onChange = {this.onPassChange}  className = "field" placeholder = "Password..."/>
            <br />
            <Button id="login-button" onClick = {this.handleLogin} primary animated >
              <Button.Content visible>Login</Button.Content>
              <Button.Content hidden>
                <Icon name='right arrow' />
              </Button.Content>
            </Button>
          </div>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
    return {
        isLoggedin: state.login.isLoggedin
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: ()=> {
            dispatch({type: "LOGIN"})
        }
    }
}

LoginScreen = connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginScreen);
  

export default LoginScreen;
