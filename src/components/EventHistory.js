import React from 'react'
import Gallery from 'react-grid-gallery';
import { Button, Icon, Image as ImageComponent, Item } from 'semantic-ui-react'

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
      event:[]
    })
  }

  loadEvents=()=> {
    this.props.socket.on('connect', () => this.setState({connecting: null}))
    this.props.socket.on('disconnect', () => this.setState({connecting: true}))
    this.props.socket.emit('getEvents', {userId: this.props.artist._id});
    this.props.socket.on('getEvents', (res)=> {
      console.log(res)
      if(res.err) return alert ('Error')
      this.setState({event: res.events})
    })
  }

  componentDidMount(){
    this.loadEvents()
  }
  
  componentWillUnmount(){

  }
  
  render() {

    return (
      <div>
        {/* <Gallery images={IMAGES} backdropClosesModal={true} /> */}
        {/* document.getElementById('example-0') */} 
        <Item.Group>
    
          {this.state.event.map(event =>

            <div>
              {event.eventName}
            </div>
            
          )}
        </Item.Group> 
      </div> 
    )
  }
}

