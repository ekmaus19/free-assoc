import React, {Component} from 'react';
import { Card, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'
import {CreateEvent} from './CreateEvent.js'
import MainMap from './Map';
import ContactList from './ContactList';
import EventHistory from './EventHistory';
import Scout from './Scout';


const url = 'http://localhost:1337'

// toMap = () => this.props.redirect('Map')


const renderContent=(mode, socket, artist, setMode, contacts, contactList) => { //functional component
  switch (mode) {
    case 'T1':
    return (
      <div>
        <Header style={{padding:'10px'}} as='h2'>Events</Header>
        <EventHistory artist={artist} socket={socket}/>
      </div>
    )
    case 'T2':
    return (
      <div>
        <Header as='h2'>Create Event</Header>
        <CreateEvent socket={socket} artist={artist} setMode={setMode} />

      </div>
    )
    case 'T3':
    return (
      <div>
        <Header as='h2'>Search for fellow artists</Header>
        <Scout artist={artist} contacts={contacts}/>
      </div>
    )
    case 'T4':
    return (
      <div>
        <Header as='h3'>Map View</Header>
         <MainMap isArtist={true} />
      </div>
    )
    case 'T5':
    return (
      <div>
        <Header as='h2'>My Connections</Header>
        <ContactList artist={artist} contacts={contacts} contactList={contactList} socket={socket}/>
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
        {renderContent(props.mode, props.socket, props.artist, props.setMode, props.contacts, props.contactList)}

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
      switched: false,
      contacts: [],
      img:{}
    }
  }

  componentDidMount() {
    this.contactList()
  }

  onLogout = () => {
    // console.log('loggingout !!!')
    fetch(url+'/logout', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log('redirect!!!!')
      sessionStorage.removeItem("loginArtist")
      this.props.redirect('Home')
    })
    .catch((error) => {
      console.log(error);
    })
  }

  contactList = () => {
    fetch(url + `/contacts/${this.props.artist._id}`, {
      method: 'GET',
    }).then(res => res.json())
    .then(json => {
      console.log('JSON ---->', json)
      this.setState({
        contacts: json.contacts,
      })
    })
    .catch((err) => {
      throw err
    })
  }

  render(){
    // console.log(this.props.artist)

    let src;
     if (this.props.artist.medium === 'music' && this.props.artist.img === null){
       src = '/img/1.png'
     } else if (this.props.artist.medium === 'art'&& this.props.artist.img === null){
      src = '/img/2.png'
     } else if (this.props.artist.medium === 'performance' && this.props.artist.img === null){
       src = '/img/3.png'
     } else {
       src = 'http://localhost:1337/artist/'+ this.props.artist._id +'/profileimg'
     }

    return(
      <div>
        <Container style={{width:'100%', padding:'100px'}}>
          {/* <br /> */}
          <br />
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Container >
                  <Card style={{justifyContent:'center', alignItems:'center'}}>
                    <Container >
                    <Image style={{marginLeft:'auto',marginRight:'auto',width:'75%', height:'75%',padding:'10px'}} src={src} />
                    </Container>
                    <Card.Content>
                      <Card.Header>{this.props.artist.firstName} {this.props.artist.lastName}</Card.Header>
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
                        {this.state.contacts.length} Friends
                      </a>
                    </Card.Content>
                    <Button style={{textAlign:'center'}} color = 'violet' className = "logout-button"  animated onClick = {() => this.onLogout()}>Logout</Button>
                  </Card>


                </Container>
              </Grid.Column>
              <Grid.Column width={13}>
                <Container style={{height:'100%'}} >
                  <SidebarExampleVisible  artist={this.props.artist} socket={this.props.socket} mode={this.state.mode} setMode={(mode)=> {this.setState({mode:mode})}} contacts={this.state.contacts} contactList={this.contactList}/>
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
