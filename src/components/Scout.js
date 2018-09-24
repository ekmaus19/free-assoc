import React from 'react';
import { Card, Input, Modal, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'

const url = 'http://powerful-bastion-26209.herokuapp.com'

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
      artist: [],
      event:[],
      connection:[],
      modalViewCardIsOpen: false,
      requester: '',
      invitee: '',
    }
  }

  findArtist = () => {
    fetch(url + '/scout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medium: this.state.medium
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          artist: json.artist
        })
        console.log('artist --->', json.artist)
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
        <div style={{display:'inline', marginBotton:'20px'}}>
        <Input style={{height:'200%', marginRight:'10px', marginBottom:'30px'}}
        type='text'
        placeholder='Search by Medium'
        onChange={(e) => (this.setState({medium:e.target.value}))}></Input>
        <Button basic color='violet' onClick={()=> {this.findArtist()}}> Go!</Button>
        </div>

        <Container style={{marginBottom:'20px'}} >
          <Card.Group itemsPerRow={4}>

          {this.state.artist.map((artist,i)=>
          <Card style={{justifyContent:'center', alignItems:'center'}}>
            <Container >
              <Image style={{marginLeft:'auto',marginRight:'auto',width:'75%', height:'75%',padding:'10px'}} src={'http://powerful-bastion-26209.herokuapp.com/artist/'+ artist._id +'/profileimg'}/>
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
                  Past Events:
                  {artist.events}
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
      </div>
    )
  }
}

export default Scout;
