import React, {Component} from 'react';
import {Button, Icon, Input, Image} from 'semantic-ui-react';
import {connect} from 'react-redux';
const url = 'http://powerful-bastion-26209.herokuapp.com';
class LoginScreen extends Component {
 constructor(props){
  super(props);
  this.state = {
   username: '',
   password: '',
   isArtist: props.isArtist ? true : false,
   hits:null
  }
 }

 componentDidMount(){
   // get session
   const loginArtist = sessionStorage.getItem("loginArtist")
   const loginUser = sessionStorage.getItem('loginUser');
   if (loginArtist) {
    // this.setState({hits: JSON.parse(loginArtist) })
    this.props.artistInfo(JSON.parse(loginArtist), () => this.props.redirect('ArtistDash'))
  } else if (loginUser) {
    this.props.userLoginToggle();
    this.props.redirect('MainMap')
  }

 }

 onLoginUser = () => {
  fetch(url+ '/login/user', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   credentials: 'same-origin',
   body: JSON.stringify({
    username: this.state.username,
    password: this.state.password
   })
  })
  .then((response) => response.json())
  .then((responseJson) => {
   if (responseJson.success) {
     console.log(responseJson.user)
     // session Storage
     sessionStorage.setItem("loginUser", JSON.stringify(responseJson.user))
     this.props.userLoginToggle();
     this.props.redirect('MainMap')
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
  this.setState({
   isArtist: true,
 })

  fetch(url+'/login/artist', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   'credentials': 'same-origin',
   body: JSON.stringify({
    username: this.state.username,
    password: this.state.password
   })
  })
  .then((response) => response.json())
  .then((responseJson) => {
   if (responseJson.success){
    console.log(responseJson.artist)
    // session Storage
    sessionStorage.setItem("loginArtist", JSON.stringify(responseJson.artist))
    this.props.artistInfo(responseJson.artist)
    this.props.redirect('ArtistDash')
   } else{ alert('Invalid Login') }
  })
  .catch((error) => {
   console.log('****',error)
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
      <div style={{width:'30%', height:'30%',alignItems:'center',justifyContent:'center', marginLeft:'auto',marginRight:'auto', marginTop:'40px'}}>
      <Image src='/img/font2.png' />
      </div>
     <div className = "input-container">
      <Input onChange = {this.onUsernameChange} className = "field" placeholder = "Username..."/>
      <br/>
      <Input onChange = {this.onPassChange} type='password' className = "field" placeholder = "Password..."/>
      <br />
      <br />
      <Button color = 'orange' className = "login-button" animated onClick = {this.onLoginArtist}>
      <Button.Content visible>Artist Login</Button.Content>
      <Button.Content hidden>
       <Icon name='right arrow'  />
      </Button.Content>
     </Button>
     <Button color = 'violet' className = "login-button" animated onClick = {this.onLoginUser}>
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
//   return {
//     isLoggedin: state.login.isLoggedin
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     login: ()=> {
//       dispatch({type: "LOGIN"})
//     }
//   }
// }
// LoginScreen = connect(
//   mapStateToProps,
//   mapDispatchToProps
//  )(LoginScreen);
export default LoginScreen;
