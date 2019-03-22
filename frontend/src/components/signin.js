import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { TextField } from '@material-ui/core';
import { parseHash, parseJwt, randomString } from "../util/util"
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { startEventListener, verifyUser, getInitialEvents, getStreamerId } from '../services/event';


const client_id = "e8dax1gddtspssvrhdnjcydilajnh8"

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Signin extends Component{
  constructor(props) {
    super(props);
    this.state = {name: "", events: [], id: ""}
  }

  componentDidMount() {
    if (document.location.hash && !localStorage.getItem('loggedIn')){
      // NOTE: if user protected twitch endpoints needs to be called in the future
      // need to handle user token storage in backend
      const urlHashes = parseHash(document.location.hash)
      // quick hacky solution, get streamer from redirect oauth, no xsrf check due to lack of backend...
      const streamerName = decodeURIComponent(decodeURIComponent(urlHashes.state)).split(',')[0]
      if(verifyUser(urlHashes['access_token'])){
        this.setState({name: streamerName})
        localStorage.setItem('dummyToken', true)

      }
    }
    else{
      localStorage.removeItem('dummyToken')
    }

  }
  
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSignin = () => {
    const nounce = randomString(10)
    const state = this.state.name+','+nounce
    window.location =`https://id.twitch.tv/oauth2/authorize?
    client_id=${client_id}
    &redirect_uri=https://streamlabs-frontend.herokuapp.com
    &response_type=token id_token
    &scope=openid
    &state=${state}`.split(' ').join('')
  }

  render () {
    const { classes } = this.props;
    if (localStorage.getItem("dummyToken") && this.state.name){
      return <Redirect to={{
        pathname: '/streamer',
        state: { streamer: this.state.name }
      }} />;
    }
    return (
      // template copied from https://github.com/mui-org/material-ui
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <TextField
            fullWidth
            id="standard-name"
            label="Your Favorite Twitch Streamer"
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <div className={classes.form}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleSignin}
              disabled={!this.state.name}
            >
              Get latest update for {this.state.name}
            </Button>
          </div>
        </Paper>
      </main>
    );
  }
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signin);