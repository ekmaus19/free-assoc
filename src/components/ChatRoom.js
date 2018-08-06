import React from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: []
    }
  }

  componentDidMount() {
    this.props.socket.on('message', () => {
      let messageList = this.state.messages
      messageList.push({username: this.props.username, content: this.state.message})
      this.setState({messages: messageList})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.roomName !== this.props.roomName) {
      this.setState({messages: []})
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({messages: this.state.messages.concat({username: this.props.username, content: this.state.message})})
    this.setState({message: ''})
    this.props.socket.emit('message', this.state.message)
  }

  handleNewMessage(e) {
    this.setState({message: e.target.value})
  }

  render () {
    return (
      <div>
        <ul>
          {this.state.messages.map(item => <ul>{`${item.username}: ${item.content}`}</ul>)}
        </ul>
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <input
          type="text"
          onChange={(e) => this.handleNewMessage(e)}
          value={this.state.message}
        />
        <button type = "submit">Send</button>
      </form>
    </div>
    )
  }
    }

export default ChatRoom;
