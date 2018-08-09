import React, {Component} from 'react';
import { Card, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'
import {CreateEvent} from './CreateEvent.js'
import MainMap from './Map';
import ContactList from './ContactList';
import EventHistory from './EventHistory'

const url = 'http://1c65b18b.ngrok.io'


// toMap = () => this.props.redirect('Map')


const renderContent=(mode, socket, artist, redirect, event) => { //functional component
  switch (mode) {
    case 'T1':
    return (
      <div>
        <Header as='h2'>Past Events</Header>
        <EventHistory event={event} artist={artist} socket={socket}/>
      </div>
    )
    case 'T2':
    return (
      <div>
        <Header as='h2'>Create Event</Header>
        <CreateEvent redirect={redirect} socket={socket}/>

      </div>
    )
    case 'T3':
    return (
      <div>
        <Header as='h2'>Scout</Header>
        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
      </div>
    )
    case 'T4':
    return (
      <div>
        <Header as='h3'>Map View</Header>
         <MainMap />
      </div>
    )
    case 'T5':
    return (
      <div>
        <Header as='h2'>Contact</Header>
        <ContactList socket={socket}/>
      </div>
    )

  }

}

const SidebarExampleVisible = (props) => (

  <Sidebar.Pushable as={Segment}>
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      direction='right'
      vertical
      visible
      inverted
      width='thin'>
      <Menu.Item as='a' onClick={()=>{props.setMode('T1')}}>
        <Icon name='file alternate' />
        Events
      </Menu.Item>
      <Menu.Item as='a' onClick={()=>{props.setMode('T2')}}>
        <Icon name='edit' />
        New Event
      </Menu.Item>
      <Menu.Item as='a' onClick={()=>{props.setMode('T3')}}>
        <Icon name='search' />
        Scout
      </Menu.Item>
      <Menu.Item as='map' onClick={()=>{ props.setMode('T4');}}>
        <Icon name='map' />
        Map
      </Menu.Item>

      <Menu.Item as='a' onClick={()=>{props.setMode('T5')}}>
        <Icon name='chat' />
        Connect
      </Menu.Item>

    </Sidebar>

    <Sidebar.Pusher>
      <Container style={{paddingTop:'20px',paddingLeft:'30px',paddingRight:'185px'}} basic >
        {renderContent(props.mode, props.socket, props.artist, props.event,props.redirect)}

      </Container>
    </Sidebar.Pusher>
  </Sidebar.Pushable>
)


class ArtistDash extends Component {
  constructor(props){
    super(props)
    this.state={
      mode:'T1',
      visible:false,

    }
  }


  onLogout = () => {
    console.log('loggingout !!!')
    fetch(url+'/logout', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('redirect!!!!')
      this.props.redirect('Home')
    })
    .catch((error) => {
      console.log(error);
    })
  }



  render(){

    return(
      <div>
        <Container style={{display:'flex'}}>

        </Container>
        <Container>
          <br />
          <br />
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <Container>
                  <Card style={{justifyContent:'center', alignItems:'center'}}>
                    <Image style={{width:'75%', height:'75%',padding:'10px'}} src='/img/1.png' />
                    <Card.Content>
                      <Card.Header>{this.props.artist.firstName} {this.props.artist.lastName}</Card.Header>
                      <Card.Meta>
                        <span className='date'>Joined in 2018</span>
                      </Card.Meta>
                      <Card.Description>
                        <h2> {this.props.artist.medium}</h2>
                        <br />
                        {this.props.artist.bio}

                        <br />
                        {this.props.artist.existingWork}

                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a>
                        <Icon name='user' />
                        22 Friends
                      </a>
                    </Card.Content>
                    <Button style={{marginLeft:'auto', marginRight:'auto'}} color = 'grey' className = "logout-button"  animated onClick = {this.onLogout}>
                    <Button.Content visible>Logout</Button.Content>
                    <Button.Content hidden>
                      <Icon name='right arrow'   />
                    </Button.Content>
                  </Button>

                  </Card>


                </Container>
              </Grid.Column>
              <Grid.Column width={12}>
                <Container style={{height:'100%'}}  >
                  <SidebarExampleVisible event={this.props.event} redirect={this.props.redirect} artist={this.props.artist} socket={this.props.socket} mode={this.state.mode} setMode={(mode)=> {this.setState({mode:mode})}}/>
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

      </div>
    )
  }

}


// const mapStateToProps=(state)=>{
//     return {
//         artist: state
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         login: (artist)=> {
//             dispatch({type: "ARTISTINFO", artist})
//         }
//     }
// }

// ArtistDash = connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(ArtistDash);



export default ArtistDash
