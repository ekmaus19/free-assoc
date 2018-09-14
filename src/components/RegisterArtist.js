import React, {Component} from 'react';
import {Button,Icon, Select,Input, Image, Message} from 'semantic-ui-react';
import axios from 'axios';
const url = 'http://localhost:1337'

const options = [
    { key: 'art', text: 'Art', value: 'art' },
    { key: 'music', text: 'Music', value: 'music' },
    { key: 'performance', text: 'Performance', value: 'performance' },
  ]

class RegisterArtist extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFile:null,
      firstName: '',
      lastName: '',
      username:'',
      password: '',
      passwordRepeat:'',
      email:'',
      phone: '',
      medium: '',
      existingWork: '',
      bio: '',
      tag: [],
      facebook:'',
      instagram:'',
      twitter:'',
      errors: []
    }
  }

  // Registeration Content Functions ------------------------------------------

  onFirstnameChange = (event) =>{
    this.setState({
      firstName: event.target.value
    })
  }

  onLastnameChange = (event) =>{
    this.setState({
      lastName: event.target.value,
    })
  }

  onUsernameChange = (event) =>{
    this.setState({
      username: event.target.value,
    })
  }

  onEmailChange = (event) =>{
    this.setState({
      email: event.target.value
    })
  }

  onPhoneChange = (event) =>{
    this.setState({
      phone: event.target.value
    })
  }

  onPassChange = (event) =>{
    this.setState({
      password: event.target.value
    })
  }

  onConfirmChange = (event) =>{
    this.setState({
      passwordRepeat: event.target.value,
    })
  }

  onMediumChange = (event,{value}) => {
      this.setState({
          medium: value
      })
  }
  onFacebookChange = (event,{value}) => {
    this.setState({
        facebook: value
    })
}

  onInstagramChange = (event,{value}) => {
  this.setState({
      instagram: value
  })
  }

  onTwitterChange = (event,{value}) => {
    this.setState({
        twitter: value
    })
    }

  onSampleChange = (event) => {
    this.setState({
        existingWork: event.target.value
    })
    }

  onBioChange = (event) => {
    this.setState({
        bio: event.target.value
    })
    }


    onRegister = (e) => {
      console.log('register')
      let errors = []
      const registerArtist ={
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        medium: this.state.medium,
        username: this.state.username,
        password: this.state.password,
        passwordRepeat: this.state.passwordRepeat,
        email: this.state.email,
        phone: this.state.phone,
        existingWork: this.state.existingWork,
        bio: this.state.bio,
        facebook: this.state.facebook,
        instagram: this.state.instagram,
        twitter: this.state.twitter
      }

      const {description, selectedFile}=this.state;
      e.preventDefault();
      console.log(selectedFile,'*******')
      let formData = new FormData();
      formData.append('info', JSON.stringify(registerArtist))
      formData.append('selectedFile', selectedFile)

      axios.post('http://localhost:1337/register/artist', formData)
      .then((result)=> {

        // Response => { data: {}, ....} because of axios call
        // Checking if Registeration was valid

        if (result.data.success) {
          this.props.redirect('Login')
        } else {
          for (var error in result.data.errors) {
            errors.push(result.data.errors[error].message);
          }
          this.setState({errors});
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    fileSelectedHandler=(event)=>{
      this.setState({
        selectedFile: event.target.files[0]
      })
    }
  // Validation Functions ------------------------------------------------------
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
        <div style={{width:'70%', marginRight:'auto', marginLeft:'auto'}}>
          <Input style={{width:'190px', marginRight:'20px', marginBottom:'5px'}} onChange = {this.onFirstnameChange}  placeholder='First name' />
          <Input style={{width:'190px'}}  onChange = {this.onLastnameChange}  placeholder='Last name' />
          <div>
          <Input onChange = {this.onUsernameChange} className = "field" placeholder = "Username"/>
          <br />
          <Input onChange = {this.onEmailChange} className = "field" placeholder = "Email"/>
          <br />
          <Input onChange = {this.onPhoneChange} className = "field" placeholder = "Phone"/>
          <br />
          <Input type='password' onChange = {this.onPassChange} className = "field" placeholder = "Password"/>
          <br />
          <Input type='password' onChange = {this.onConfirmChange} className = "field" placeholder = "Confirm Password"/>
          <br />
          <Select style={{width:'400px'}} onChange = {this.onMediumChange} compact options={options} className = "field" placeholder = "Medium"/>
          <br />
          <Input onChange = {this.onSampleChange} className = "field" placeholder = "Sample Work Link"/>
          <br />

          <Input style={{height:'100px'}} onChange = {this.onBioChange} className = "field" placeholder = "Text us a little about yourself..."/>
          <br />
           <div>
            <Button color='facebook'>
            <Icon name='facebook' /> Facebook
            </Button>
          <Input style={{width:'265px'}} onChange = {this.onFacebookChange} className = "field" placeholder = "Link to Page"/>
           </div>
           <div>
          <Button color='instagram'>
          <Icon name='instagram' /> Instagram
          </Button>
          <Input style={{width:'265px'}} onChange = {this.onInstagramChange} className = "field" placeholder = "Link to Page"/>
          </div>
          <div>
          <Button color='twitter'>
           <Icon name='twitter' /> Twitter
          </Button>
          <Input style={{width:'280px'}} onChange = {this.onTwitterChange} className = "field" placeholder = "Link to Page"/>
          </div>

          <Input style={{marginRight:'auto'}} type='file' onChange={this.fileSelectedHandler} />
          </div>

          <br />
          <Button color = 'pink' className = "register-button"  animated onClick={this.onRegister}>
              <Button.Content visible>Register</Button.Content>
              <Button.Content hidden>
                <Icon name='right arrow' />
              </Button.Content>
            </Button>
        </div>
      </div>
    );
  }
}
export default RegisterArtist;
