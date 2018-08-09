import React, {Component} from 'react';
import {Button, Icon, Input} from 'semantic-ui-react';
import {connect} from 'react-redux';

const url = 'http://1c65b18b.ngrok.io'

class LoginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  onLoginUser = () => {
    fetch(url+ '/login/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.user)
      if (responseJson.success) {
        this.props.redirect('Maps')
      } else{
        alert('Invalid Login')
      }
    })
    .catch((error) => {
      alert('Invalid Login')
    })
  }

  onLoginArtist = () => {
    console.log(url)

    fetch(url+'/login/artist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){
        console.log(responseJson.artist)
        this.props.artistInfo(responseJson.artist)
        this.props.redirect('ArtistDash')

      } else{ alert('Invalid Login') }
    })
    .catch((error) => {
      alert('Invalid Login')
    })
  }

  onUsernameChange = (event) =>{
    this.setState({
      username: event.target.value
    })
  }

  onPassChange = (event) =>{
    this.setState({
      password: event.target.value
    })
  }

  render() {

    return (
      // display: flex;
      // align-items: right;
      // justify-content: flex-start;
      <div>

      <div className = "login">

          <div className = "input-container">
            <Input onChange = {this.onUsernameChange}  className = "field" placeholder = "Username..."/>
            <br/>
            <Input onChange = {this.onPassChange}  className = "field" placeholder = "Password..."/>
            <br />
            <br />
            <Button color = 'blue' className = "login-button"  animated onClick = {this.onLoginArtist}>
            <Button.Content visible>Artist Login</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow'   />
            </Button.Content>
          </Button>
          <Button color = 'grey' className = "login-button"  animated onClick = {this.onLoginUser}>
            <Button.Content visible>User Login</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps=(state)=>{
//     return {
//         isLoggedin: state.login.isLoggedin
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         login: ()=> {
//             dispatch({type: "LOGIN"})
//         }
//     }
// }

// LoginScreen = connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(LoginScreen);


export default LoginScreen;
