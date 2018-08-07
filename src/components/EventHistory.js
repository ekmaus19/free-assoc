import React from 'react'
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';

const IMAGES =
[{
        src: "./img/music.jpg",
        thumbnail: "./img/music.jpg",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "./img/jazz.jpeg",
        thumbnail: "./img/jazz.jpeg",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "./img/speakeasy.jpg",
        thumbnail: "./img/speakeasy.jpg",
        thumbnailWidth: 200,
        thumbnailHeight: 200
}]



export default class EventHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      events:[]
    })
  }

  loadEvents=()=> {
    this.props.socket.on('connect', () => this.setState({connecting: null}))
    this.props.socket.on('disconnect', () => this.setState({connecting: true}))
    this.props.socket.emit('getEvents', {userId: this.props.artist._id}, (res)=> {
      if(res.err) return alert ('Error')
      this.setState({events: res.events})
    })
  }

  componentDidMount(){
    this.loadEvents()
  }

  render() {
    return (
      <div>
         <h2 style={{marginRight:"auto"}} className='PastEvents'>
          Past Events 
        </h2>
        <Gallery images={IMAGES} backdropClosesModal={true} />
        {/* document.getElementById('example-0') */}

        <div>
          {/* <br/>
          <Item.Group divided>
            {this.state.docs.map(doc =>
              <Item>
                <Item.Content>
                  <Item.Header as='a' onClick={() => this.link(doc._id)}>{doc.title}</Item.Header>
                  <Item.Meta>
                    <span className='creator'>Creator: <div>{doc.collabs[0].username}</div></span>
                  </Item.Meta>
                  <Item.Description>Collaborators: {doc.collabs.map(user => <div>{user.username}</div>)} </Item.Description>
                  <Item.Extra>
                    <Button onClick = {() => this.deleteDocument(doc._id)} floated='right' id="delete-button"><Icon name='trash' /></Button>
                  </Item.Extra>
                </Item.Content>
              </Item>)}
            </Item.Group>
          </div>
          <div>
            <button className="Logout" type="submit" onClick={this.onLogout}>Logout</button>
          </div> */}

      </div>
      </div> 
    )
  }
}

