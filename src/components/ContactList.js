import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root')

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
      contacts: [],
      sent: [],
      received: [],
      username: '',
      connection: '',
      requester: '',
      invitee: '',
      modalSearchIsOpen: false,
      modalPendingIsOpen: false
    }
    this.openSearchModal = this.openSearchModal.bind(this);
    this.closeSearchModal = this.closeSearchModal.bind(this);

    this.openPendingModal = this.openPendingModal.bind(this);
    this.closePendingModal = this.closePendingModal.bind(this);
  }

  async componentDidMount() {
    await this.contactList()
    console.log(this.state)
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

  contactList = () => {
    fetch(url + `/contacts/5b62233284dd7663147a4ff3`, {
      method: 'GET',
    }).then(res => res.json())
    .then(json => {
      console.log('JSON ---->', json)
      this.setState({
        contacts: json.contacts,
      })
    })
    .catch((err) => {
      throw err
    })
  }

  sentInvites = () => {
    fetch(url + '/pending/sent', {
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
    fetch(url + '/pending/received', {
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
    fetch(url + '/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username
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

  acceptConnection = () => {

  }

  declineConnection = () => {

  }

  render() {
    const renderContacts = () => {
      if (this.state.contacts) {
        return this.state.contacts.map(contacts => {
          return (
            <div>
              {contacts.username}
            </div>
          )
        })
      }
    }
    return (
      <div>
        <div>
          {renderContacts()}
        </div>
        <div>
        <button onClick={() => this.openSearchModal()}>Make a new friend!</button>
        <Modal isOpen={this.state.modalSearchIsOpen} style={customStyles}>
          <input type='text' placeholder='enter artist username' onChange={(e) => (this.setState({username:e.target.value}))}></input>
          <button onClick={() => this.sendConnection()}>Connect</button>
          <button onClick={() => this.closeSearchModal()}>Cancel</button>
        </Modal>
      </div>
      <div>
        <button onClick={() => this.openPendingModal()}>Pending connections</button>
          <Modal isOpen={this.state.modalPendingIsOpen} style={customStyles}>
            Sent Invites
            {this.state.username}
            <button onClick={() => this.closePendingModal()}>Close</button>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Contact;
