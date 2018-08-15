import React from 'react'
import Gallery from 'react-grid-gallery';
import { Checkbox,Card, Button, Icon, Image, Item, Label,Form, Container} from 'semantic-ui-react'

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
      console.log(events)
  

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


  toggleSwitch=()=> {
    this.setState(prevState => {
      return {
        switched: !prevState.switched
      }
    })
  }
  
  render() {
    
   console.log(this.state.event)
    
   let {event,switched} = this.state
    
   if (switched){
    event = event.filter((event)=>{
      const date= new Date(event.datesRange.substr(0,9))
      if(date < Date.now()){
        return true; 
      } else{
        return false; 
      }
   })
  }
  

    return (
      <div style={{padding:'20px'}}>

        <Container style={{display:'flex', justifyContent:'flex-end',marginBottom:'30px'}} > 
          <Label basic color='violet' pointing='right' style={{width:'80%',marginRight:'auto'}} >
          Current Events
          </Label>
        <Checkbox slider style={{marginRight:'30px',marginRight:'30px',padding:'20px'}} onClick={this.toggleSwitch} on={this.state.switched}/>
        <Label basic color='violet' pointing='left' style={{marginLeft:'auto'}} >
          Past Events
          </Label>
        </Container> 

        <Card.Group itemsPerRow={5}>
          {event.map((event,i) =>
            <div>
              <Card 
              style={{height:'100%'}}
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
                {event.startTime} - {event.endTime}
                <br /> 
                {event.streetAddress}
                <br /> 
                {event.city},
                {event.country}
                <br /> 
                Tags: 
                {event.tags}
              </a> 
              }
              raised image={'http://localhost:1337/event/'+ event._id +'/profileimg'} />

            </div>
          
          )}
        </Card.Group> 
      </div> 
    )
  }
}

// raised image={this.state.images[i]}
