import React, { Component } from 'react';
import { createStore } from 'redux';
import { ModuleProvider } from 'redux-modules';
import { combineReducers, install } from 'redux-loop';
import App from './components/App';

const store = createStore(s => s, {}, install());

export default class MarkdownBlog extends Component {
  render() {
    return (
      <ModuleProvider combineReducers={combineReducers} store={store}>
        <App />
      </ModuleProvider>
    );
  }
}
