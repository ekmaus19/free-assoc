import React, {Component} from 'react';
import {Button, Icon, Input} from 'semantic-ui-react';

class RegisterScreenPicker extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>

        <Button color = 'pink' className = "artist-button"  animated onClick = {() => this.props.redirect('RegisterArtist')}>
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

    );
  }
}
export default RegisterScreenPicker;
