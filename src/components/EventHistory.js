import React from 'react'
import Gallery from 'react-grid-gallery';
import { Checkbox,Card, Button, Icon, Image, Item} from 'semantic-ui-react'

const src = './img/music.jpg' 

export default class EventHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      selectedevent:[],
      pastevents:[],
      futureevents:[],
      event:[],
      img:{},
      switched: false
    })
  }

  loadEvents=()=> {
    this.props.socket.on('connect', () => this.setState({connecting: null}))
    this.props.socket.on('disconnect', () => this.setState({connecting: true}))
    this.props.socket.emit('getEvents', {userId: this.props.artist._id});
    this.props.socket.on('getEvents', ({events})=> {
      // console.log(events)
      // events.forEach((i)=>{
      //   if(i.img.data){
      //     console.log(i.img.data)
      //     var string = btoa(i.img.data.data)
      //     i.img= 'data:image/jpeg;charset=utf-8;base64,'+ string
      //     console.log('weweewew',string)
      //     console.log('**********', i.img)
      //   }
      // })
      this.setState({event: events, pastevents:events.filter((event)=>{
        const date= new Date(event.datesRange.substr(0,9))
        if(date < Date.now()){
          return true; 
        } else{
          return false; 
        }
      }),futureevents: events.filter((event)=>{
        const date= new Date(event.datesRange.substr(0,9))
        if (date > Date.now()){
          return true;
        } else {
          return false;
        }
      }) })
    })
  
  }

  componentDidMount(){
    this.loadEvents()
  }
  
  componentWillUnmount(){

  }

  toggleSwitch=()=> {
    this.setState(prevState => {
      return {
        switched: !prevState.switched
      }
    })
  }
  
  render() {
    
   console.log(this.state.event)
    return (
      <div style={{padding:'20px'}}>
        <div style={{display:'flex', justifyContent:'flex-end',marginBottom:'30px'}} > 
        <Checkbox slider style={{marginLeft:'auto',padding:'20px'}} onClick={this.toggleSwitch} on={this.state.switched}/>
        </div> 
        {/* <Gallery images={IMAGES} backdropClosesModal={true} /> */}
        {/* document.getElementById('example-0') */} 
        <Card.Group itemsPerRow={5}>
          {this.state.event.map((event,i) =>
            <div>
              <Card 
              header={event.eventName}
              meta={event.medium}
              description={event.about}
              extra={
                <a>
                {event.price}
                <br /> 
                {event.venueName}
                <br /> 
                {event.datesRange}
                <br /> 
                {event.streetAddress}
                <br /> 
                {event.city},
                {event.country}
              </a> 
              }
              raised image={src} />

            </div>
          
          )}
        </Card.Group> 
      </div> 
    )
  }
}

// raised image={this.state.images[i]}
