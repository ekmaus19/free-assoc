import React from 'react'
import Gallery from 'react-grid-gallery';
import { Checkbox,Card, Button, Icon, Image, Item, Label,Form, Container} from 'semantic-ui-react'

const src = './img/music.jpg'

export default class EventHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      selectedevent:[],
      events:[],
      img:{},
      switched: false
    })
  }

  loadEvents = () => {
    this.props.socket.on('connect', () => this.setState({connecting: null}))
    this.props.socket.on('disconnect', () => this.setState({connecting: true}))
    this.props.socket.emit('getEvents', {userId: this.props.artist._id});
    this.props.socket.on('getEvents', ({events}) => {
      this.setState({events})
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

  let {events,switched} = this.state

  if (switched){

    events = events.filter((event)=>{
      const date = new Date()

      // ---------- Setting Date to correct date -----------
      // new Date(event.substring()) returns an Invalid date
      date.setDate(event.datesRange.substring(0,2))
      date.setMonth(event.datesRange.substring(3,5) - 1) // january = 0, feb = 1...
      date.setFullYear(event.datesRange.substring(6,10))
      // ----------------------------------------------------

      // date.getTime() returns number of milliseconds. Date.now() returns milliseconds
      if(date.getTime() < Date.now()){
        return true;
      } else{
        return false;
      }
    })

  } else {

    events = events.filter((event)=>{
      const date = new Date()

      // ---------- Setting Date to correct date -----------
      // new Date(event.substring()) returns an Invalid date
      date.setDate(event.datesRange.substring(0,2))
      date.setMonth(event.datesRange.substring(3,5) -1) // january = 0, feb = 1...
      date.setFullYear(event.datesRange.substring(6,10))
      // ----------------------------------------------------
      // date.getTime() returns number of milliseconds. Date.now() returns milliseconds
      if (date.getTime() > Date.now()){
        return true;
      } else {
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
        {events.map((event,i) =>
          <div key={event._id}>
            <Card
              style={{height:'100%'}}
              header={event.eventName}
              meta={event.medium}
              description={event.about}
              extra={
                <a>
                  <label style={{fontWeight:'bold'}} > Event Price: </label>
                  $ {event.price}
                  <br />
                  <label style={{fontWeight:'bold'}}> Venue Name:  </label>
                  {event.venueName}
                  <br />
                  <label style={{fontWeight:'bold'}}> Date:  </label>
                  {event.datesRange}
                  <br />
                  <label style={{fontWeight:'bold'}}> Time:  </label>
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
              raised image={'http://powerful-bastion-26209.herokuapp.com/event/'+ event._id +'/profileimg'} />

            </div>

          )}
        </Card.Group>
      </div>
    )
  }
}
