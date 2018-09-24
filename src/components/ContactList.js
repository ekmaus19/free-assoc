import React from 'react';

import { Input, Button, Card, Container,Image, Modal } from 'semantic-ui-react'


const url = 'http://localhost:1337'

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
    openViewContactModal() {
      this.setState({
        modalViewContactIsOpen: true,
      });
    }

    closeViewContactModal() {
      this.setState({
        modalViewContactIsOpen: false,
      });
    }
   //////

   deleteContactModal = (contactid) => {
    console.log(this.state.contacts)
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
      console.log('JSON ---->', json)
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
      console.log('JSON ---->', json)
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
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          connection: json.connection,
          modalSearchIsOpen:false
        })
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
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          connection: json.connection,
          modalPendingIsOpen: false
        })
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
      console.log('JSON ----->', json)
      if (json.success) {
        this.setState({
          connection: json.connection,
          modalPendingIsOpen: false
        })
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
        return this.props.contacts.map(contacts => {
          console.log(contacts)
          return (
            <div>
            <Card.Group itemsPerRow={4}>
            <Card  >
              <Card.Content>
                <Image floated='right' size='mini' src={'http://localhost:1337/contacts/'+ contacts._id +'/profileimg'} />
                <Card.Header>{contacts.username}</Card.Header>
                <Card.Meta>{contacts.medium}</Card.Meta>
                <Card.Description textAlign='left'>
                  {contacts.bio}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div style={{display:'flex'}}>
                  <Button basic color='orange' onClick={() => this.openViewContactModal()}>
                    View Contact
                  </Button>
                  <Modal
                  open={this.state.modalViewContactIsOpen}
                  size={'tiny'}
                  style={customStyles}
                  dimmer={'inverted'}
                  onClose={this.closeViewContactModal}
                  >
                  <div>
                  Email:
                  {contacts.email}
                  <br />
                  Phone #:
                  </div>
                  <div className='ui two buttons'>
                  <Button basic color='violet' onClick={()=> this.deleteContactModal(contacts._id)} >
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
          console.log(sent)
          return (
            <div>
              {sent.invitee.username}
            </div>
          )
        })
      }
    }
    const renderReceived = () => {
      if (this.state.received) {
        return this.state.received.map((received, i) => {
          return (
            <div key = {i}>
              {received.requester.username}
              <br />
              <div style={{display:'inline', justifyContenet:'center', marginTop:'20px'}}>
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
          style={customStyles}>
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
