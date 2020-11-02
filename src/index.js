import React from 'react';
import { Router, Route, Switch } from 'react-router'
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './App';
import Game from './components/Game/Game'
import Sidebar from './components/Sidebar/Sidebar'

ReactDOM.render(
  <div>
    <Sidebar />
    <Router history={createBrowserHistory()}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/game" component={Game}/>
    </Switch>
  </Router>
  </div>,
  document.getElementById('root')
);
