import React from 'react';
import io from 'socket.io-client';
import ChatRoom from './ChatRoom';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomName: "Artist Chatroom",
      username: ''
    };
  }

  componentDidMount() {
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
          Join the Artist Chatroom
        </button>
        <ChatRoom socket = {this.props.socket} roomName = {this.state.roomName}
          username = {this.state.username}/>
      </div>
    );
  }
}

export default Chat;
