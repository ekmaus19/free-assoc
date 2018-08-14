import React, {Component} from 'react';
import {Button, Icon, Input, Image} from 'semantic-ui-react';
const url = 'http://localhost:1337'

class RegisterScreenPicker extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
       <div style={{width:'25%', height:'25%',alignItems:'center',justifyContent:'center', marginLeft:'auto',marginRight:'auto', marginTop:'40px'}}>
      <Image src='/img/font2.png' />
      </div >
      <div style={{padding:'20px'}}> 
        <Button style={{margin:'50px'}} color = 'pink' className = "artist-button"  animated onClick = {() => this.props.redirect('RegisterArtist')}>
            <Button.Content visible>Register as Artist</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
        <br />
        <br />

        <Button color = 'yellow' className = "user-button"  animated onClick = {() => this.props.redirect('RegisterUser')}>
            <Button.Content visible>Register as User</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
        </div> 
      </div>

    );
  }
}
export default RegisterScreenPicker;
