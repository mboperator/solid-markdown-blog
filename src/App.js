import React, { Component } from 'react';
import logo from './logo.svg';
import solid from 'solid-client';
import './App.css';
import CreatePost from './components/CreatePost';

const ns = solid.vocab;

class App extends Component {
  state = {
    currentProfile: '',
    errors: '',
  };

  handleLogin = () => {
    const solidUserUrl = this.urlInput.value || 'mpowered.databox.me';

    solid.login(`https://${solidUserUrl}`)
      .then(solid.getProfile)
      .then(profile => {
        this.setState({
          currentProfile: profile,
        });
      })
      .catch(e => {
        this.setState({
          errors: e,
        });
      });
  }

  handleSignup = () => {
    solid.signup()
      .then(webId => {
        this.setState({
          currentProfile: webId,
        });
      })
      .catch(e => {
        this.setState({
          errors: e,
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>This blog is solid.</h2>
        </div>
        {this.state.currentProfile ?
          <span>Welcome, {this.state.currentProfile.name}</span>
          :
          <div>
            Log in as:
            <input
              ref={elem => this.urlInput = elem}
              placeholder={'mpowered.databox.me'}
            />
            <button onClick={this.handleLogin}>
              Login
            </button>
            <button onClick={this.handleSignup}>
              Signup
            </button>
          </div>
        }
        {this.state.currentProfile &&
          <CreatePost webId={this.state.currentProfile.webId} />
        }
      </div>
    );
  }
}

export default App;
