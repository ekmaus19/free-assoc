import React from 'react';
import TimeRangePicker from 'react-time-range-picker';
import { Container,Button,Form, Input, Select,TextArea,Icon,Message } from 'semantic-ui-react'
import {
    DatesRangeInput,
    DateTimeInput,
  } from 'semantic-ui-calendar-react';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import cors from 'cors';
import suggestionsList from './suggestion_categories'
// import GOOGLE_API_KEY from '../../env.sh'

var geocoder = require('google-geocoder');
var geo = geocoder({
  key: 'AIzaSyAs7riE2xT80wzGfYJq8SpjisLjDvSNeZA'
});

// console.log(geo.find)
// const Nominatim = require('nominatim-geocoder')
// const geocoder = new Nominatim({
//   secure: true
// })

//tags
const KeyCodes = {
  comma: 188,
  enter: 13,
};
const options = [
  { key: 'art', text: 'Art', value: 'art' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'performance', text: 'Performance', value: 'performance' },
]
const delimiters = [KeyCodes.comma, KeyCodes.enter];

  export class CreateEvent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedFile:null,
        eventName: '',
        venueName: '',
        medium:'',
        startTime: '',
        endTime:'',
        datesRange: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        medium: '',
        price: '',
        about: '',
        tags: [],
        priceError: 'none',
      suggestions:[suggestionsList]
      };
    }
    handleDelete=(i)=> {
      const {tags} = this.state
      this.setState({
        tags: tags.filter((tag,index)=> index !==i)
      })
    }
    handleAddition=(tag)=>{
      this.setState(state=> ({tags:[...state.tags,tag]}))
    }
    handleDateChange = (event, {name, value}) => {
      if (this.state.hasOwnProperty(name)) {
        this.setState({ [name]: value });
      }
    }
    // handleTimeChange = (event, {name, value}) => {
    //   if (this.state.hasOwnProperty(name)) {
    //     this.setState({ [name]: value });
    //   }
    // }
    pickerupdate = (start_time, end_time) => {
      // start and end time in 24hour time
      this.setState({startTime: start_time, endTime: end_time})
    }
    handleDrag=(tag, currPos, newPos)=>{
      const tags = [...this.state.tags];
      const newTags = tags.slice();
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);
      // re-render
      this.setState({ tags: newTags });
  }
  onCreate = (e) => {
    const self = this;
    let query = this.state.streetAddress + ', ' + this.state.city + ', ' + this.state.state + ', ' + this.state.country
    const createEvent = {
      eventName: this.state.eventName,
      eventCreator: this.props.artist._id,
      venueName: this.state.venueName,
      medium: this.state.medium,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      datesRange: this.state.datesRange,
      streetAddress: this.state.streetAddress,
      city: this.state.city,
      state: this.state.state,
      country: this.state.country,
      about: this.state.about,
      price: this.state.price,
      tags: this.state.tags
  }
    const { description, selectedFile} = this.state;
    // e.preventDefault();

    let formData = new FormData();
    formData.append('info', JSON.stringify(createEvent))
    formData.append('selectedFile',selectedFile);

    geo.find(query, function(err, result) {
      console.log(result)
      console.log(result[0])
      if (result[0]) {
        formData.append('latitude', result[0].location.lat)
        formData.append('longitude', result[0].location.lng)
      }

      axios.post('http://localhost:1337/fileUpload', formData)
      .then(function (result) {
        if (result.data.success) {
          self.props.setMode('T1');
        }
      })
      .catch(err => {
        console.log(err)
      })
    // })
   //  geocoder.search({q:query})
   // .then((response)=> {
   // formData.append('selectedFile', selectedFile);
   //   formData.append('latitude', response[0].lat)
   //   formData.append('longitude', response[0].lon)
   //   return axios.post('http://localhost:1337/fileUpload', formData);
   // })
    // .then((result)=> {
    //   console.log('redirect****')
    // // }).catch((err)=> {
    //   this.props.setMode('T1')
    //   console.log(err)
    })
    }
    onEventNameChange = (event) => {
      this.setState({
        eventName: event.target.value
      })
    }
    onAddressChange = (event) => {
      this.setState({
        streetAddress: event.target.value
      })
    }
    onCityChange = (event) => {
      this.setState({
        city: event.target.value
      })
    }
    onStateChange = (event) => {
      this.setState({
        state: event.target.value
      })
    }
    onCountryChange = (event) => {
      this.setState({
        country: event.target.value
      })
    }
  onEventNameChange = (event) => {
    this.setState({
      eventName: event.target.value
    })
  }
  onAddressChange = (event) => {
    this.setState({
      streetAddress: event.target.value
    })
  }
  onCityChange = (event) => {
    this.setState({
      city: event.target.value
    })
  }
  onStateChange = (event) => {
    this.setState({
      state: event.target.value
    })
  }
  onCountryChange = (event) => {
    this.setState({
      country: event.target.value
    })
  }
  onVenueNameChange = (event) => {
    this.setState({
      venueName: event.target.value
    })
  }
  onAboutChange = (event) => {
    this.setState({
      about: event.target.value
    })
  }
  onMediumChange = (event,{value}) => {
    this.setState({
        medium: value
    })
}
  onPriceChange = (event) => {
    if (isNaN(Number(event.target.value)) === false) {
      this.setState({
        price: event.target.value,
        priceError: 'none'
      })
    } else {
      this.setState({
        priceError: 'block'
      })
    }

 }
  fileSelectedHandler=(event)=>{
    this.setState({
      selectedFile: event.target.files[0]
    }, () => console.log(this.state.selectedFile))
  }
    render() {
      const {tags,suggestions} = this.state
      return (
        <Form>
          <Form.Group style={{display:'flex'}}>
          <Form.Field required control={Input} label='Event Name' placeholder='Event Name' onChange={this.onEventNameChange} />
          <Form.Field required control={Input} label='Venue Name' placeholder='Venue Name' onChange={this.onVenueNameChange}/>
        </Form.Group>
        <Form.Group inline>
           <label>Medium</label>
           <br />
          <Select label='Medium' style={{width:'100%'}} onChange = {this.onMediumChange} options={options} className = "field" />
        </Form.Group>
          From - To
          <DatesRangeInput
            inline
            name="datesRange"
            placeholder="Date Range"
            value={this.state.datesRange}
            iconPosition="left"
            onChange={this.handleDateChange} />
            <br />
          Event Time
          <TimeRangePicker hourmarkers hourlines timeupdate={this.pickerupdate} style={{height: '500px', width: '500px', marginBottom: '60px'}}/>
             <br />
            <Form.Field required control={TextArea} label='About' placeholder='Tell us a little more about the event...' onChange={this.onAboutChange} />
          <br />
             <Form.Field required control={Input} label='$' placeholder='Price' onChange={this.onPriceChange} value={this.state.price} />
             <Message
                error
                header='Please enter numbers only'
                style={{display: this.state.priceError}}
              />
             <Form.Field required control={Input} label='Street Address' placeholder='Street Address' onChange={this.onAddressChange} />
             <Form.Field required control={Input} label='City' placeholder='City' onChange={this.onCityChange}/>
             <Form.Field required control={Input} label='State' placeholder='State'  onChange={this.onStateChange}/>
             <Form.Field required control={Input} label='Country' placeholder='Country' onChange={this.onCountryChange}/>
             <div style={{position:'relative', width:'150%', background:'light-grey',  display:'flex', justifyContent:'center'}}>
                <ReactTags
                    tags={tags}
                    suggestions={suggestions[0]}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} />
            </div>
            <br />
            <div style={{display:'flex'}} >
            <Input required style={{marginRight:'auto', width:'100%'}} type='file' onChange={this.fileSelectedHandler} name='selectedFile' />
            </div>
            <br />
            <Button style={{margin:'20px',marginLeft:'auto',marginRight:'auto', alignItems:'center'}} color = 'pink' className = "logout-button"  animated onClick = {this.onCreate}>
             <Button.Content visible>Create Event Go!</Button.Content>
                 <Button.Content hidden>
                     <Icon name='right arrow'   />
                 </Button.Content>
             </Button>
        </Form>
      );
    }
  }
