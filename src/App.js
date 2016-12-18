import React, { Component } from 'react';
import logo from './logo.svg';
import solid from 'solid-client';
import './App.css';
import CreatePost from './components/CreatePost';

const ns = solid.vocab;
const DEFAULT_CONTAINER = 'Posts';

class App extends Component {
  state = {
    currentProfile: '',
    errors: '',
  };

  updateStatus = (status, payload) => {
    this.setState({ status }, () => {
      console.log(status, payload);
    });
  }

  handleLogin = () => {
    const inputValue = this.urlInput.value;
    const solidUserUrl = inputValue ? `https://${inputValue}` : 'https://mpowered.databox.me';

    solid.login(solidUserUrl)
      .then(solid.getProfile)
      .then(profile => {
        this.updateStatus('Profile loaded', profile);
        return profile.loadAppRegistry();
      })
      .then(profile => {
        const registrationResults = profile.appsForType(ns.sioc('MarkdownBlog'))
        if (registrationResults.length) { return profile; }
        else {
          this.updateStatus('App is not registered, registering');
          const options = {
            name: 'Markdown Blog',
            shortdesc: 'A Solid backed markdown blog',
            redirectTemplateUri: 'https://localhost:3000',
          };
          const typesForApp = [ ns.sioc('MarkdownBlog'), ns.dct('MarkdownBlog') ];
          const isListed = true;
          const app = new solid.AppRegistration(options, typesForApp, isListed);
          return profile.registerApp(app);
        }
      })
      .then(profile => {
        this.updateStatus('App registered, checking for container', profile);
        return solid.web.get(`${solidUserUrl}/${DEFAULT_CONTAINER}/`)
          .then(response => {
            return profile;
          })
          .catch(e => {
            this.updateStatus('Container does not exist, creating');
            return solid.web.createContainer(solidUserUrl, DEFAULT_CONTAINER)
              .then(containerResponse => {
                debugger;
                return profile;
              });
          });
      })
      .then(profile => {
        this.updateStatus('App initialization complete!');
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
