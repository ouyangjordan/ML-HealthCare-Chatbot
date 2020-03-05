import {Component} from "react";
import React from "react";
import logo from './logo.png';
import Config from './config.js'

class Messages extends Component {

  //This is so the messages scroll to the bottom when chatting
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.scrollBottom.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const {messages} = this.props;
    return (
        <ul className="Messages-list fade-in">
          {messages.map(m => this.renderMessage(m))}
        </ul>
    );
  }

  renderMessage(message) {
    const {member, text} = message;
    const {currentMember} = this.props;
    const messageFromUser = member.username !== "ChatBot";
    console.log(member);
    const className = messageFromUser ?
      "Messages-message currentMember" : "Messages-message";
    return (
      <div>
        <li className={className}>
        <span
          className={ messageFromUser ? 'avatar' : 'hidden'}
          style={{backgroundColor: member.color}}
        />
        <img src={logo} alt="logo" className={ messageFromUser ? 'hidden' : 'avatar'}/>
          <div className={ messageFromUser ? 'Message-content' : 'Message-content fade-in'}>
            <div className="username">
              {member.username}
            </div>
            <div className="text">{text}</div>
          </div>
        </li>
        <div ref={scrollBottom => { this.scrollBottom = scrollBottom; }} />
      </div>
    );
  }
}

export default Messages;