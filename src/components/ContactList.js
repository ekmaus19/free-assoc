import React from 'react';
import io from 'socket.io-client';


class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      username: ''
    };
  }

  componentDidMount() {
    console.log('WEEEEEE')
    this.state.socket.on('connect', () => {
      console.log('connected to chatroom');
      let username = prompt('enter username')
      this.setState({username: username})
      this.state.socket.emit('username', username)
      this.state.socket.emit('room', this.state.roomName)
    });

    this.state.socket.on('errorMessage', message => {
      alert(message)
    });
  }

  join(room) {
    console.log(room);
    this.setState({roomName: room})
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <button className="btn btn-default" onClick={() => this.join("Artist Chatroom")}>
          Contact List
        </button>
     
      </div>
    );
  }
}

export default Contact;
