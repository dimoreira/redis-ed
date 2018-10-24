import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ipcRenderer  = window.ipcRenderer;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      databaseCount: 0
    };

    this.onRedisConnected = this.onRedisConnected.bind(this);
    this.onRedisConnectError = this.onRedisConnectError.bind(this);
    this.onRedisDatabaseCount = this.onRedisDatabaseCount.bind(this);

    ipcRenderer.on("redis-connected", this.onRedisConnected);
    ipcRenderer.on("redis-connect-error", this.onRedisConnectError);
    ipcRenderer.on("redis-database-count", this.onRedisDatabaseCount);
  }

  doConnectRedis() {
    ipcRenderer.send("redis-connect", { a: 1, b: 2 });
  }

  onRedisConnected() {
    console.log("redis-connected");
  }

  onRedisDatabaseCount(_, count) {
    this.setState({ databaseCount: count });
  }

  onRedisConnectError() {

  }

  render() {
    return (
      <div className="App">
        <div>
          <a onClick={ this.doConnectRedis }>Connect</a>
          { this.state.databaseCount }
        </div>
      </div>
    );
  }
}

export default App;
