import React, {Component} from 'react';
import { Button, Checkbox, Form, Input, Radio, Grid,Select, TextArea,Icon } from 'semantic-ui-react'
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
  } from 'semantic-ui-calendar-react';

  export class CreateEvent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        eventName: '',
        eventCreator: '',
        venueName: '',
        date: '',
        time: '',
        dateTime: '',
        datesRange: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        about: ''

      };
    }
  
    handleChange = (event, {name, value}) => {
      if (this.state.hasOwnProperty(name)) {
        this.setState({ [name]: value });
      }
    }
    

  onCreate = () => {
    console.log('ON CREATE*********************',this.state)
    this.props.socket.emit('createEvent', {
        eventName: this.state.eventName,
        eventCreator: this.state.eventCreator,
        venueName: this.state.venueName,
        date: this.state.date,
        time: this.state.time,
        datesRange: this.state.datesRange,
        streetAddress: this.state.streetAddress,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        about: this.state.about
    }, (res) => {
      console.log(res)
      if(res.err) {
        return alert('Opps Error')
      }else{
        alert('Saved')
      }

    })
  }


  // onUsernameChange = (event) =>{
  //   this.setState({
  //     username: event.target.value
  //   })
  // }
    render() {
      return (
        <Form>
          <Form.Group> 
          <Form.Field control={Input} label='Event Name' placeholder='Event Name' onChange={this.eventName} />
          <Form.Field control={Input} label='Event Creator' placeholder='Event Creator' onChange={this.eventCreator} />
        </ Form.Group>
          <DateInput
            name="date"
            inline
            placeholder="Date"
            value={this.state.date}
            iconPosition="left"
            onChange={this.handleChange} />
            <br /> 
          <TimeInput
            inline
            name="time"
            placeholder="Time"
            value={this.state.time}
            iconPosition="left"
            onChange={this.handleChange} />
             <br /> 
         
          <DatesRangeInput
            inline
            name="datesRange"
            placeholder="From - To"
            value={this.state.datesRange}
            iconPosition="left"
            onChange={this.handleChange} />
            <Form.Group> 
           <Form.Field control={Input} label='Street Address' placeholder='Street Address' onChange={this.streetAddress} />
             <Form.Field control={Input} label='City' placeholder='City' onChange={this.city}/>
             <br />
             <br />
             <Form.Field control={Input} label='State' placeholder='State'  onChange={this.state}/>
             <Form.Field control={Input} label='Country' placeholder='Country' onChange={this.country}/>
             <Form.Field control={Input} label='Venue Name' placeholder='Venue Name' onChange={this.venueName}/>
             <Form.Field control={TextArea} label='About' placeholder='Tell us more about you...' onChange={this.about} />
            </Form.Group>
            <Button style={{display:'flex', alignItems:'center'}} color = 'pink' className = "logout-button"  animated onClick = {this.onCreate}>
             <Button.Content visible>Create Event Go!</Button.Content>
                 <Button.Content hidden>
                     <Icon name='right arrow'   />
                 </Button.Content>
             </Button>
        </Form>
      );
    }
  }
  

// export class CreateEvent extends Component {
//     constructor(props){
//         super(props)
//         this.state = {}
//     }

//     handleChange = (e, { value }) => this.setState({ value })
  
//     render() {
//       const { value } = this.state
//       return (
       
    
//         <Form >
//           <Form.Group widths={6}>
//             <Form.Field control={Input} label='Event Name' placeholder='Event Name' />
//             <Form.Field control={Input} label='Event Creator' placeholder='Event Creator' />
//             <Form.Field control={Input} label='Venue Name' placeholder='Venue Name' />

//             <Form.Field control={Input} label='Time' placeholder='Time' />
//             <Form.Field control={Input} label='Street Address' placeholder='Street Address' />
//             <Form.Field control={Input} label='City' placeholder='City' />
//             <Form.Field control={Input} label='State' placeholder='State' />
//             <Form.Field control={Input} label='Country' placeholder='Country' />
//             <Form.Field control={Input} label='Venue Name' placeholder='Venue Name' />
//           </Form.Group>
          
    
//           <Form.Field control={TextArea} label='About' placeholder='Tell us more about you...' />
//           <Form.Field control={Checkbox} label='I agree to the Terms and Conditions' />
//           <Button color = 'grey' className = "logout-button"  animated onClick = {this.onLogout}>
//             <Button.Content visible>Create Event Go!</Button.Content>
//                 <Button.Content hidden>
//                     <Icon name='right arrow'   />
//                 </Button.Content>
//             </Button>
//         </Form>
    
//       )
//     }
// }

