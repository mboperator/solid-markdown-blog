import React, { Component } from 'react';
import { connectModule } from 'redux-modules';
import solid from 'solid-client';
import './App.css';

import module from './module';
import CreatePost from '../CreatePost';
import Posts from '../Posts';

const DEFAULT_CONTAINER = 'Posts';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" alt="logo" />
          <h2>This blog is solid.</h2>
        </div>
        {this.props.profile ?
          <span>Welcome, {this.props.profile.name}</span>
          :
          <div>
            Log in as:
            <input
              value={this.props.webId}
              onChange={({target}) => this.props.actions.setWebId(target.value)}
              placeholder={'mpowered.databox.me'}
            />
            <button onClick={this.props.actions.login}>
              Login
            </button>
            <button onClick={this.props.actions.signup}>
              Signup
            </button>
          </div>
        }
        {this.props.profile &&
          <div>
            <CreatePost
              baseUrl={this.props.webId}
              container={DEFAULT_CONTAINER}
            />
            <Posts
              baseUrl={this.props.webId}
              container={DEFAULT_CONTAINER}
              dispatch={this.props.actions.updatePosts}
              {...this.props.posts}
            />
          </div>
        }
      </div>
    );
  }
}

export default connectModule(module)(App);
