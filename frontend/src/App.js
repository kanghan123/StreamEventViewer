import React, { Component } from 'react';
import Streamer from './components/streamer'
import Signin from "./components/signin";
import './App.css'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

const client_id = "e8dax1gddtspssvrhdnjcydilajnh8"

class App extends Component{
  handleSignin = () => {
    window.location =`https://id.twitch.tv/oauth2/authorize?
    client_id=${client_id}
    &redirect_uri=https://streamlabs-frontend.herokuapp.com
    &response_type=token
    &scope=openid`.split(' ').join('')
  }

  render () {
    return (      
    <Router>
      <Route path="/" exact component={Signin} />
      <Route path="/streamer" component={Streamer} />
      <Route path="/redirect" component={Streamer} />
    </Router>
    )
  }
}

export default App;