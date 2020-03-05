import {Component} from "react";
import React from "react";

class Input extends Component {
  state = {
    text: ""
  }

  // Update state if text field value changes
  onChange(e) {
    this.setState({text: e.target.value});
  }

  // Handle messages sent
  onSubmit(e) {
    e.preventDefault();
    this.setState({text: ""});
    this.props.onSendMessage(this.state.text);
  }

  render() {
    return (
      <div className="Input">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            disabled={this.props.disableInput}
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            placeholder="Enter your message and press ENTER"
            autoFocus={true}
          />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default Input;