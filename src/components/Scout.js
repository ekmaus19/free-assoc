import React from 'react';
import { Card, Input, Modal, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'

const url = 'http://localhost:1337'

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
      searching: 'none'
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

  // findEvent=() => {

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

  openViewCardModal() {
    this.setState({
      modalViewCardIsOpen: true,
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
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-disk">
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
              <Image style={{marginLeft:'auto',marginRight:'auto',width:'75%', height:'75%',padding:'10px'}} src={'http://localhost:1337/artist/'+ artist._id +'/profileimg'}/>
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
                <Button basic color="violet" style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}} color = 'orange' onClick={() => this.openViewCardModal()}>View Profile</Button>

                <Modal
                  onClose={this.closeViewCardModal}
                  dimmer={'inverted'}
                 size={'small'}
                  open={this.state.modalViewCardIsOpen}
                  style={customStyles}>
                  <div style={{ margin: '1em'}}>
                    <Image src={'http://localhost:1337/artist/'+ artist._id +'/profileimg'} style={{ width: '30%'}}/>
                    <h5>Name: {artist.firstName} {artist.lastName}</h5>
                    <h5>Medium: {artist.medium} </h5>
                    <h5>Bio: {artist.bio} </h5>
                    <h5>Work: {artist.existingWork}</h5>
                    Past Events:
                    {artist.events}
                  </div>
                  <div style={{display:'flex', justifyContent:'center'}}>

                  <Button
                  style={{display:'inline', justifyContent:'flex-end',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}}
                  basic color = 'red'
                  onClick={() => this.closeViewCardModal()}>Close</Button>
            </div>

          </Modal>




                <br />
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
