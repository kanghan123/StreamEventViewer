import React from 'react';
import Grid from '@material-ui/core/Grid';
import Simplelist from './eventList';
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import io from 'socket.io-client';
import { startEventListener, verifyUser, getInitialEvents, getStreamerId } from '../services/event';


const rootStyle = {height: "97%"}

// TODO: setup configs
const client_id = "e8dax1gddtspssvrhdnjcydilajnh8"


class Streamer extends React.Component {
  constructor(props) {
    super(props);
    const state = this.props.location.state
    this.state = {events: [], stream_id: null}
    this.socket = io.connect('https://streamlabs-backend.herokuapp.com');
  }
  handleSignout = () => {
    localStorage.removeItem("dummyToken");
    window.location="/";
  }

  async componentDidMount(){
    const response_id = await fetch(`https://api.twitch.tv/helix/users?login=${this.props.location.state.streamer}`, {
      headers: {
          "Client-Id": client_id
      },
    });
    const json_id = await response_id.json(); 
    const id = json_id.data[0]["id"]
    this.setState({ stream_id: id });

    const response_events = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=10`, {
      headers: {
          "Client-Id": client_id
      },
    });
    try {
      const events = await response_events.json();
      var json_events = events.data
      if (json_events.length > 10 ){
        json_events = json_events.slice(0,9)
      }
      this.setState({events:json_events})
    }
    catch(e){
      console.log(e)
    }

    console.log(id)
    startEventListener(client_id, id).then(
      console.log("subscribed")
    )
    this.socket.on('connect', this.joinRoom)
    this.socket.on('new event', this.pushEvent)
  }

  pushEvent = (event) => {
    var events = this.state.events
    var i = events.length
    while (i>=10){
      events.pop()
      i = events.length
    }
    events.unshift(event)
    this.setState({events: events})
  }

  joinRoom = () => {
    this.socket.emit('room', this.state.stream_id);
  }

  render() {
    console.log(this.state.events)
    const streamer = this.props.location.state.streamer
    if (!localStorage.getItem('dummyToken')){
      return <Redirect to="/" />
    }
    return (
      <div style={rootStyle}>
        <Grid container style={rootStyle} spacing={16}>
          <Grid item>
              <iframe frameBorder="0"
                      scrolling="no"
                      id="chat_embed"
                      src={`https://www.twitch.tv/embed/${streamer}/chat`}
                      height="80%"
                      width="80%">
              </iframe>
          </Grid>
          <Grid item xs={8}>
              <iframe
                  src={`https://player.twitch.tv/?channel=${streamer}&muted=true`}
                  height="80%"
                  width="90%"
                  frameBorder="0"
                  scrolling="no"
                  padding="2"
                  margin="2"
                  allowFullScreen={true}>
              </iframe>
          </Grid>
          <Grid item>
              {this.state.events && <Simplelist items={this.state.events}/>}
          </Grid>
        </Grid>
        <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={this.handleSignout}
        >
          log out
        </Button>
      </div>
    );
  }
}
  
export default Streamer;