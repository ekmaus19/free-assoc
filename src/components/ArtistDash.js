import React, {Component} from 'react';
import { Card, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'
import {CreateEvent} from './CreateEvent.js'


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
const renderContent=(mode, socket) => { //functional component
  switch (mode) {
    case 'T1':
    return (
    <div>
    <Header as='h3'>Events</Header>
    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
    </div>
    )
    case 'T2':
    return (
    <div>
    <Header as='h2'>Create Event</Header>
    <CreateEvent socket={socket}/>

    </div>
    )
    case 'T3':
    return (
    <div>
    <Header as='h3'>Scout</Header>
    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
    </div>
    )
    case 'T4':
    return (
    <div>
    <Header as='h3'>Map View</Header>
    <Image src='/img/map.png' />
    </div>
    )
    case 'T5':
    return (
    <div>
    <Header as='h3'>Message</Header>
    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
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
      inverted
      vertical
      visible
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
        <Menu.Item as='map' onClick={()=>{props.setMode('T4')}}>
          <Icon name='map' />
          Map
        </Menu.Item>

        <Menu.Item as='a' onClick={()=>{props.setMode('T5')}}>
          <Icon name='chat' />
          Connect
        </Menu.Item>

      </Sidebar>

      <Sidebar.Pusher>
        <Container style={{paddingTop:'20px',paddingLeft:'30px',paddingRight:'185px',width:'100%'}} basic >
        {renderContent(props.mode, props.socket)}

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

   onLogout = () => this.props.redirect('App')


    render(){

        return(
            <div>
                      <Container style={{display:'flex'}}>
                      <Button color = 'grey' className = "logout-button"  animated onClick = {this.onLogout}>
                          <Button.Content visible>Logout</Button.Content>
                          <Button.Content hidden>
                            <Icon name='right arrow'   />
                          </Button.Content>
                        </Button>
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
                            </Card>
                            </Container>
                    </Grid.Column>
                    <Grid.Column width={12}>
                            <Container style={{height:'100%'}}  >
                                 <SidebarExampleVisible  socket={this.props.socket} mode={this.state.mode} setMode={(mode)=> {this.setState({mode:mode})}}/>
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
