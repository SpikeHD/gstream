import React from 'react';
import { Router, Route, Switch } from 'react-router'
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './App';
import Game from './components/Game/Game'

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/game" component={Game}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
