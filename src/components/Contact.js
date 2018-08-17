import React, {Component} from 'react';
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from 'semantic-ui-react'

class Contact extends Component {
    constructor(props){
        super(props)

    }

  
    render(){
        return(
            <div  > 
            <h2>Contact Us</h2>
            <br />
            <div style={{display:'flex',justifyContent:'center'}}> 
             <Form stlye={{width:'50%'}} >
                <Form.Group widths='equal'>
                <Form.Field control={Input} label='First name' placeholder='First name' />
                <Form.Field control={Input} label='Last name' placeholder='Last name' />
                </Form.Group>
                <Form.Group inline>
                
                </Form.Group>
                <Form.Field control={Input} label='Email' placeholder='Email' />
                <Form.Field control={TextArea} label='About' placeholder='Tell us more about you...' />
                <Form.Field control={Checkbox} label='I agree to the Terms and Conditions' />
                <Form.Field control={Button}>Contact Us</Form.Field>
            </Form>
            </div>
            
            </div>
        )

    }
}

export default Contact;