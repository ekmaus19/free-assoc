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
    fetch(url + `/connect/${this.props.artist._id}`, {
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
          return (
            <div>
              {contacts.username} : {contacts.email}
            </div>
          )
        })
      }
    }
    const renderSent = () => {
      if (this.state.sent) {
        return this.state.sent.map(sent => {
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
              <button onClick={() => this.acceptConnection(received.requester._id)}>Accept</button>
              <button onClick={() => this.declineConnection(received.requester._id)}>Decline</button>
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
            {renderSent()}
            Received invites
            {renderReceived()}
            <button onClick={() => this.closePendingModal()}>Close</button>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Contact;
