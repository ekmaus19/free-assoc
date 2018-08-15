import React from 'react';
import { Card, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'

const url = 'http://localhost:1337'

class Scout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medium: '',
      artist: []
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

  onMediumChange = (e) => {
    this.setState ({
      medium: e.target.value
    })
  }

  render () {
    return (
      <div>
        Search for fellow artists<br /><br />
        <input type='text' placeholder='enter medium' onChange={(e) => (this.setState({medium:e.target.value}))}></input>
        <button onClick={() => this.findArtist()}>Go!</button>

        <Container >
          <Card style={{justifyContent:'center', alignItems:'center'}}>
            <Container >
              <Image style={{marginLeft:'auto',marginRight:'auto',width:'75%', height:'75%',padding:'10px'}} src='/img/1.png' />
            </Container>
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
                {this.props.contacts.length} Friends
              </a>
            </Card.Content>
          </Card>
        </Container>
      </div>
    )
  }
}

export default Scout;
