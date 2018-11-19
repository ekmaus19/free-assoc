import React from 'react';

import { Input, Button, Card, Container,Image, Modal } from 'semantic-ui-react'


const url = 'https://powerful-bastion-26209.herokuapp.com'

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

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sent: [],
      received: [],
      username: '',
      connection: [],
      requester: '',
      invitee: '',
      events: [],
      modalSearchIsOpen: false,
      modalPendingIsOpen: false,
      modalViewContactIsOpen: false,
    }
    this.openSearchModal = this.openSearchModal.bind(this);
    this.closeSearchModal = this.closeSearchModal.bind(this);

    this.openPendingModal = this.openPendingModal.bind(this);
    this.closePendingModal = this.closePendingModal.bind(this);
  }

  async componentDidMount() {
    await this.props.contactList()
    await this.sentInvites()
    await this.receivedInvites()
  }

  openSearchModal() {
    this.setState({
      modalSearchIsOpen: true,
    });
  }

  closeSearchModal() {
    this.setState({
      modalSearchIsOpen: false,
    });
  }

  openPendingModal() {
    this.setState({
      modalPendingIsOpen: true,
    });
  }

  closePendingModal() {
    this.setState({
      modalPendingIsOpen: false,
    });
  }

    ///// View Contact Modal
    openViewContactModal(contact) {
      this.props.socket.emit('getEvents', {userId: contact});
      this.props.socket.on('getEvents', ({events}) => {
        this.setState({events, modalViewContactIsOpen: true }, () => console.log(this.state.events))
      })
    }

    closeViewContactModal() {
      this.setState({
        modalViewContactIsOpen: false,
      });
    }
   //////

   deleteContactModal = (contactid) => {

     fetch(url + `/delete/${contactid}`,{
       method: 'POST',
     }).then(res => res.json())
     .then(json => {
       if (json.success){
      this.setState({
        contacts: json.contacts,
      })
      alert('Deleted')
      this.componentDidMount()
     }
     })
     .catch((err)=> {
       throw err
     })
   }

  sentInvites = () => {
    fetch(url + `/pending/sent/${this.props.artist._id}`, {
      method: 'GET',
    }).then(res => res.json())
    .then(json => {

      this.setState({
        sent: json.sent
      })
    })
    .catch((err) => {
      throw err
    })
  }

  receivedInvites = () => {
    fetch(url + `/pending/received/${this.props.artist._id}`, {
      method: 'GET',
    }).then(res => res.json())
    .then(json => {

      this.setState({
        received: json.received
      })
    })
    .catch((err) => {
      throw err
    })
  }

  onUsernameChange = (e) => {
    this.setState ({
      username: e.target.value
    })
  }

  sendConnection = () => {
    fetch(url + `/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        requester: this.props.artist._id,
      })
    })
    .then(res => res.json())
    .then(json => {

      if (json.success) {
        this.setState({
          connection: json.connection,
          modalSearchIsOpen:false
        })
        this.sentInvites();
        alert('Invite sent!')
      }
    })
    .catch((err) => {
      throw err
    })
  }

  acceptConnection = (requester) => {
    fetch(url + `/accept/${this.props.artist._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requester: requester,
        invitee: this.props.artist._id
      })
    })
    .then(res => res.json())
    .then(json => {

      if (json.success) {
        this.setState({
          connection: json.connection,
          modalPendingIsOpen: false
        })

        this.receivedInvites();
        alert('Invite accepted!')
      }
    })
    .catch((err) => {
      throw err
    })
  }

  declineConnection = (requester) => {
    fetch(url + `/decline/${this.props.artist._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requester: requester,
        invitee: this.props.artist._id
      })
    })
    .then(res => res.json())
    .then(json => {

      if (json.success) {
        this.setState({
          connection: json.connection,
          modalPendingIsOpen: false
        })
        this.receivedInvites();
        alert('Invite declined')
      }
    })
    .catch((err) => {
      throw err
    })
  }



  render() {
    const renderContacts = () => {
      if (this.props.contacts) {
        return this.props.contacts.map(contact => {

          return (
            <div>
            <Card.Group itemsPerRow={4}>
            <Card  >
              <Card.Content>
                <Image floated='right' size='mini' src={'http://localhost:1337/contacts/'+ contact._id +'/profileimg'} />
                <Card.Header>{contact.username}</Card.Header>
                <Card.Meta>{contact.medium}</Card.Meta>
                <Card.Description textAlign='left'>
                  {contact.bio}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div style={{display:'flex'}}>
                  <Button basic color='orange' onClick={() => this.openViewContactModal(contact._id)}>
                    View Contact
                  </Button>
                  <Modal
                  open={this.state.modalViewContactIsOpen}
                  size={'tiny'}
                  style={customStyles, { padding : "1em"}}
                  dimmer={'inverted'}
                  onClose={this.closeViewContactModal}
                  >
                    <div>
                      Name: {contact.firstName} {contact.lastName}
                      <br /><br />
                      Email:
                      {contact.email}
                      <br /><br />
                      Phone #:
                      </div>
                      <br /><br />
                      Events:
                      <div style={{display: 'flex', color: 'black'}}>
                      {this.state.events.map(event => {
                        return (
                          <div>
                            <p>{event.eventName} - {event.price}</p>
                            <p>{event.datesRange}</p>
                            <p>{event.startTime} - {event.endTime}</p>
                            <p>{event.venueName}</p>
                            <p>{event.streetAddress}, {event.city}, {event.state}</p>
                          </div>
                        )
                      })}
                      </div>
                      <div className='ui two buttons'>
                      <Button basic color='violet' onClick={()=> this.deleteContactModal(contact._id)} >
                       Delete Contact
                      </Button>
                      <Button basic color='red' onClick={() => this.closeViewContactModal()}>
                        Close
                      </Button>
                    </div>
                  </Modal>
                </div>
              </Card.Content>
            </Card>
          </Card.Group>
          </div>
          )
        })
      }
    }
    const renderSent = () => {
      if (this.state.sent) {
        return this.state.sent.map(sent => {

          return (
            <div style={{ 'margin' : "1em 0 0 1em"}}>
              <Image size='mini' src={'http://localhost:1337/artist/'+ sent.invitee._id +'/profileimg'} />
              Name: {sent.invitee.firstName} {sent.invitee.lastName} <br />
              Username: {sent.invitee.username}
            </div>
          )
        })
      }
    }
    const renderReceived = () => {
      if (this.state.received) {

        return this.state.received.map((received, i) => {
          return (
            <div key = {i} style={{ 'margin' : "1em 0 0 1em"}}>
              <Image size='mini' src={'http://localhost:1337/artist/'+ received.requester._id +'/profileimg'} />
              Name: {received.requester.firstName} {received.requester.lastName} <br />
              Username: {received.requester.username}
              <br />
              <div style={{display:'inline', justifyContent:'center', marginTop:'20px'}}>
               <Button
              color='orange'
              style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}}
              onClick={() => this.acceptConnection(received.requester._id)}>Accept</Button>
              <Button
              color='violet'
              style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}}
              onClick={() => this.declineConnection(received.requester._id)}>Decline</Button>
            </div>
            </div>
          )
        })
      }
    }
    return (
      <div>
        <div style={{display:'flex',marginLeft:'auto',justifyContent:'flex-end',marginBottom:'30px'}}>
        <div>
          <Button style={{display:'inline', padding:'3px',height:'75%',width:'100px', textAlign:'center', margin:'10px'}} basic color = 'violet' onClick={() => this.openSearchModal()}>New Connections</Button>
          <Modal
          onClose={this.state.closeSearchModal}
          open={this.state.modalSearchIsOpen}
          dimmer={'inverted'}
          size={'small'}
          style={customStyles}>
            <Input stlye={{display:'block', margin:'10px', justifyContent:'center'}} type='text' placeholder='Artist Username ...' onChange={(e) => (this.setState({username:e.target.value}))}></Input>
            <div style={{display:'flex', justifyContent:'center'}}>
            <Button style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}} color = 'orange' onClick={() => this.sendConnection()}>Connect</Button>
            <Button style={{display:'inline', justifyContent:'center',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}} basic color = 'red' onClick={() => this.closeSearchModal()}>Cancel</Button>
            </div>
          </Modal>
        </div>
        <div>
          <Button style={{padding:'3px',height:'75%',width:'100px', textAlign:'center', margin:'10px'}} basic color = 'violet' onClick={() => this.openPendingModal()}>Pending</Button>
          <Modal
          onClose={this.state.closePendingModal}
          dimmer={'inverted'}
          size={'small'}
          open={this.state.modalPendingIsOpen}
          style={customStyles, { padding : "1em 0 0 1em"}}>
            <label> Sent Invites: </label>
            {renderSent()}
            <br />
            <br />
            <label> Received invites: </label>
            {renderReceived()}
            <div style={{display:'flex', justifyContent:'center'}}>

             <Button
            style={{display:'inline', justifyContent:'flex-end',padding:'3px',height:'150%',width:'100px', textAlign:'center', margin:'10px'}}
            basic color = 'red'
            onClick={() => this.closePendingModal()}>Close</Button>
            </div>

          </Modal>
        </div>
        </div>
        <div style={{marginBottom:'30px'}}>
          {renderContacts()}
        </div>
      </div>
    )
  }
}

export default Contact;
