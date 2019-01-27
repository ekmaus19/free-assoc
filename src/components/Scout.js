import React from 'react';
import { Card, Input, Modal, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'

import url from './backend'

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

class Scout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medium: '',
      artists: [],
      findArtistErr: '',
      event:[],
      connection:[],
      modalViewCardIsOpen: false,
      requester: '',
      invitee: '',
      name: '',
      searching: 'none',
      selectedArtist: [],
      selectedArtistEvents: [],
    }
  }

  // Find Functions
  findByMedium = () => {
    this.setState({ searching: 'block' })
    fetch(url + '/scout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medium: this.state.medium.toLowerCase()
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          artists: json.artist,
          findArtistErr: '',
          searching: 'none'
        })
        console.log("success")
      } else {
        this.setState({ findArtistErr: json.error, searching: 'none'});
      }
    })
    .catch((err) => {
      throw err
    })
  }

  findByName = () => {
    this.setState({ searching: 'block'})
    fetch(url + '/scout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //using lower case to avoid case issues
        firstName: this.state.name
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState({
          artists: json.artists,
          findArtistErr: '',
          searching: 'none'
        })
        console.log("success")
      } else {
        this.setState({ findArtistErr: json.error, searching: 'none'});
      }
    })
    .catch((err) => {
      throw err
    })
  }

  findEvents = (artist) => {
    this.props.socket.on('connect', () => this.setState({connecting: null}))
    this.props.socket.on('disconnect', () => this.setState({connecting: true}))
    this.props.socket.emit('getEvents', {userId: artist._id});
    this.props.socket.on('getEvents', ({events}) => {
      this.setState({selectedArtistEvents: events})
    })
    console.log(artist)
  }

  // getContacts = (artist) => {
  //   fetch(url+`/contacts/${artist._id}`, (err, res) => {
  //     this.setState
  //   }
  // }

  onMediumChange = (e) => {
    this.setState ({
      medium: e.target.value
    })
  }

  sendConnection = (artist) => {
    fetch(url + `/connect/${this.props.artist._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        artist: artist
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          connection: json.connection,
        })
        alert('Invite sent!')
      }
    })
    .catch((err) => {
      throw err
    })
  }

  openViewCardModal(artist) {
    this.findEvents(artist);
    this.setState({
      modalViewCardIsOpen: true,
      selectedArtist: artist,
    });
  }

  closeViewCardModal() {
    this.setState({
      modalViewCardIsOpen: false,
    });
  }


  render () {

    return (
      <div style={{marginBotton:'20px'}} >
          <br />
          <br />

        {/* Search By Name */}
        <div style={{display:'inline', marginBotton:'20px'}}>
        <Input style={{height:'200%', marginRight:'10px', marginBottom:'30px'}}
        type='text'
        placeholder='Search by Name'
        onChange={(e) => (this.setState({name : e.target.value}))}></Input>
        <Button basic color='violet' onClick={()=> {this.findByName()}}> Go!</Button>
        </div>

        {/* Search By Medium*/}
        <div style={{display:'inline', marginBotton:'20px'}}>
        <select
          className="ui dropdown"
          onChange={(e) => this.setState({medium: e.target.value})}>
          <option value="" disabled selected style={{ color: '#c0c0c0' }}>Search By Medium</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="performance">Performance</option>
        </select>
        <Button basic color='violet' onClick={()=> {this.findByMedium()}}> Go!</Button>
        </div>
        {/* Loading Icon */}
        <div style={{ display: this.state.searching, width: '100px', height: '100px', margin: 'auto' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-disk">
            <g transform="translate(50,50)">
              <g ng-attr-transform="scale({{config.scale}})" transform="scale(0.7)">
                <circle cx="0" cy="0" r="50" ng-attr-fill="{{config.c1}}" fill="#7586ff"></circle>
                <circle cx="0" ng-attr-cy="{{config.cy}}" ng-attr-r="{{config.r}}" ng-attr-fill="{{config.c2}}" cy="-28" r="15" fill="#4f20b5" transform="rotate(173.316)">
                  <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 0 0;360 0 0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                </circle>
              </g>
            </g>
          </svg>
        </div>
        {this.state.findArtistErr !== '' ?
        <div style={{textAlign: 'center'}}>{this.state.findArtistErr}</div> :
        <Container style={{marginBottom:'20px'}} >
          <Card.Group itemsPerRow={4}>

          {this.state.artists.map((artist,i)=>
          <Card style={{justifyContent:'center', alignItems:'center'}}>
            <Container >
              <Image style={{marginLeft:'auto',marginRight:'auto',width:'75%', height:'75%',padding:'10px'}} src={url + '/artist/'+ artist._id +'/profileimg'}/>
            </Container>
            <Card.Content>
              <Card.Header>{artist.firstName} {artist.lastName}</Card.Header>
              <Card.Meta>
                <span className='date'>Joined in 2018</span>
              </Card.Meta>
              <Card.Description>
                <h2> {artist.medium}</h2>
                <br />
                {artist.bio}

                <br />
                {artist.existingWork}

              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                {/* {this.props.contacts.length} Friends */}
                <Button basic style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}} color = 'orange' onClick={() => this.openViewCardModal(artist)}>View Profile</Button>

                <Modal
                  onClose={this.closeViewCardModal}
                  dimmer={'inverted'}
                 size={'medium'}
                  open={this.state.modalViewCardIsOpen}
                  style={customStyles}>
                  <Grid columns={2} celled='internally'>
                    <Grid.Row stretched>
                      <Grid.Column textAlign="center" style={{textAlign: 'center'}} width={5}>
                        {/* Left Panel */}
                        <Container >
                          <Image style={{marginLeft:'auto',marginRight:'auto',width:'65%', height:'65%',padding:'10px'}} src={url + '/artist/'+ this.state.selectedArtist._id +'/profileimg'}/>
                        </Container>
                        <Card.Content>
                          <Card.Header>{this.state.selectedArtist.firstName} {this.state.selectedArtist.lastName}</Card.Header>
                          <Card.Meta>
                            <span className='date'>Joined in 2018</span>
                          </Card.Meta>
                          <Card.Description>
                            <h2> {this.state.selectedArtist.medium}</h2>
                            <br />
                            {this.state.selectedArtist.existingWork}

                          </Card.Description>
                        </Card.Content>
                        <Button style={{padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px auto auto auto'}} color = 'orange' onClick={() => this.sendConnection(artist)}>Connect</Button>
                        <Button
                        style={{display:'inline', justifyContent:'flex-end',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px auto'}}
                        basic color = 'red'
                        onClick={() => this.closeViewCardModal()}>Close</Button>
                      </Grid.Column>
                      <Grid.Column width={11} rows={3}>
                        <Grid.Row style={{ borderBottom: '1px solid #d4d4d5', height: 'auto'}} textAlign="center" verticalAlign="center">
                          {/* Top Panel */}
                          <Card.Content>
                              <Card.Description>
                                {this.state.selectedArtist.bio}
                              </Card.Description>
                          </Card.Content>
                        </Grid.Row>
                        <Grid columns={2} celled='internally' style={{ height: '250px'}}>
                          <Grid.Column floated="left">
                            <h4>Hosted Events</h4>
                            <div style={{overflowY: 'scroll', height: '170px', overflowX:'hidden'}}>
                            {this.state.selectedArtistEvents.map(event => {
                              return (
                                <Grid divided='vertically'>
                                  <Grid.Row>
                                    <Grid.Column width={6}>
                                      <Image size="tiny" src={url + '/event/'+ event._id +'/profileimg'} />
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                      <h4>{event.eventName}</h4>
                                      {event.venueName}
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              );
                            })}
                            </div>
                          </Grid.Column>
                          <Grid.Column floated="right">
                            <Grid.Row style={{height: '50%', borderBottom:  '1px solid #d4d4d5'}}>
                              <h4>Self Tags</h4>
                            </Grid.Row>
                            <Grid.Row style={{height: '50%'}}>
                              <h4>Friends</h4>
                              <div style={{ overflowY: 'scroll', overflowX: 'hidden', height: '95%' }}>
                                {this.state.selectedArtist.connections ? this.state.selectedArtist.connections.map(contact => {
                                  return (
                                    <Grid divided='vertically'>
                                      <Grid.Row>
                                        <Grid.Column width={6}>
                                          <Image size="tiny" src={url + '/contacts/'+ contact +'/profileimg'} />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                          Placeholder
                                        </Grid.Column>
                                      </Grid.Row>
                                    </Grid>
                                  );
                                }): null}
                              </div>
                            </Grid.Row>
                          </Grid.Column>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
              </Modal>

                <Button style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}} color = 'orange' onClick={() => this.sendConnection(artist)}>Connect</Button>
              </a>
            </Card.Content>
          </Card>
          )}

          </Card.Group>
        </Container>
      }
      </div>
    )
  }
}

export default Scout;
