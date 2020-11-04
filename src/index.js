import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import './index.css';
import App from './App';
import Game from './components/Game/Game'
import DownloadPage from './components/Download/DownloadPage'
import Sidebar from './components/Sidebar/Sidebar'
import DownloadBarBottom from './components/Download/DownloadBarBottom'

ReactDOM.render(
  <div>
    <Sidebar />
    <HashRouter history={createHashHistory()}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/game" component={Game}/>
      <Route path="/downloads" component={DownloadPage}/>
    </Switch>
  </HashRouter>
  <DownloadBarBottom />
  </div>,
  document.getElementById('root')
);
