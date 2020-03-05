import React, {Component} from "react";
import './App.css';
import Messages from "./Messages";
import Input from "./Input"
import Loader from './Loader';
import Config from './config'

// Remove eventually
function randomName() {
  const adjectives = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

// Remove eventually
function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

function checkWord2Vec(symptom, messages) {
  fetch('http://127.0.0.1:8000/check-symptom', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symptom: symptom,
    })
  })
  .then(res => res.json())
  .then((result) => {
    console.log(result)
    if(result.symptom_in_datatset) {
      messages.push({
        text: "Got it, we collected: " + result.symptom_in_datatset,
        member: {
          color: "blue",
          username: "ChatBot"
        } 
      })
    }
    else if(result.symptom_similar) {
      messages.push({
        text: "Got it, we collected: " + result.symptom_similar,
        member: {
          color: "blue",
          username: "ChatBot"
        } 
      })
    }
    else {
      messages.push({
        text: "Sorry, we don't recognize that symptom. Please enter a different one.",
        member: {
          color: "blue",
          username: "ChatBot"
        } 
      })
    }
  })
}

class App extends Component {
  state = {
    loading: true,
    disableInput: false,
    messages: [
      {
        text: "Welcome to Porton Health's ChatBot",
        member: {
          color: "blue",
          username: "ChatBot"
        }
      },
      {
        text: "Disclaimer: Results should not be considered as Doctor's advice",
        member: {
          color: "blue",
          username: "ChatBot"
        }
      },
      {
        text: "Let's get started! What symptoms are you having?",
        member: {
          color: "blue",
          username: "ChatBot"
        }
      }
    ],

    member: {
      username: randomName(),
      color: Config.userColor
    },

    userSymptoms:[],

    stopAsking: ["no", "none", "nah", "stop", "bye"]
  }


  constructor() {
    super();
  }

  onSendMessage = (message) => {
    const stopAsking = this.state.stopAsking
    const messages = this.state.messages
    messages.push({
      text: message,
      member: this.state.member
    })
    var disableInput = this.state.disableInput

    const userSymptoms = this.state.userSymptoms
    if(!stopAsking.includes(message)){
      // Word2Vec Validation 
      // disableInput = true;
      fetch('http://127.0.0.1:8000/check-symptom', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptom: message,
        })
      })
      .then(res => res.json())
      .then((result) => {
        console.log("Word2Vec result:")
        console.log(result)

        if(result.symptom_in_dataset) {
          userSymptoms.push((result.symptom_in_dataset).trim());
          messages.push({
            text: "Got it, we collected: " + result.symptom_in_dataset,
            member: {
              color: "blue",
              username: "ChatBot"
            } 
          })
          messages.push({
            text: "Anything else?",
            member: {
              color: "blue",
              username: "ChatBot"
            } 
          })
        }

        else if (result.symptom_similar) {
          userSymptoms.push((result.symptom_similar).trim());
          messages.push({
            text: "Got it, we collected: " + result.symptom_similar,
            member: {
              color: "blue",
              username: "ChatBot"
            } 
          })
          messages.push({
            text: "Anything else?",
            member: {
              color: "blue",
              username: "ChatBot"
            } 
          })
        }

        else {
          messages.push({
            text: "Sorry, we don't recognize that symptom. Please enter a different one.",
            member: {
              color: "blue",
              username: "ChatBot"
            } 
          })
        }
        this.setState({messages: messages, 
          userSymptoms: userSymptoms
        })
      });
      // checkWord2Vec(message, messages)
    } // End Word2Vec Validation

    console.log("User inputs are: ")
    console.log(userSymptoms)

    // User is done giving symptoms, analyze the list now
    if(stopAsking.includes(message)) {
      messages.push({
        text: "Okay so far we have: " + userSymptoms,
        member: {
          color: "blue",
          username: "ChatBot"
        } 
      })

      messages.push({
        text: "Please wait while we analyze your symptoms...",
        member: {
          color: "blue",
          username: "ChatBot"
        } 
      })

      const requestData = JSON.stringify(userSymptoms);
      console.log(requestData);

      // Get Diagnoses
      fetch('http://localhost:8000/diagnoses', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: requestData,
        })
      })
      .then(res => res.json())
      .then((result) => {
        console.log("DIAGNOSES" + result)
        messages.push({
          text: "It seems like you might have: " + result,
          member: {
            color: "blue",
            username: "ChatBot"
          } 
        })
        messages.push({
          text: "If symptoms persist, we suggest that you seek advice from your Family Doctor or a General Practitioner.",
          member: {
            color: "blue",
            username: "ChatBot"
          } 
        })

        this.setState({messages: messages})
      });
    }
    this.setState({messages: messages})
  }


  // Start up loading spinner
  // TODO: Replace arbitrary 2 second asynch wait with server response
  // https://programmingwithmosh.com/react/create-react-loading-spinner/
  componentDidMount() {
    this.wait(1000);
    //this.scrollToBottom();
  }

  wait = async (milliseconds = 2000) => {
    await this.sleep(milliseconds);
    this.setState({
      loading: false,
    });
  };

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  //End of spinning loading stuff

  render() {
    if (this.state.loading) return <Loader/>;
    return (
      <div className="App">
        <div className="App-header" style={{backgroundColor: Config.backgroundColor}}>
          <h1>{Config.chatBotName}</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
        onSendMessage={this.onSendMessage}
        /> 
      </div>
    );
  }
}

export default App;
