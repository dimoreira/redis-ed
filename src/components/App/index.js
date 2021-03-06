import React from 'react';
import ConnectionForm from "../ConnectionForm";
import DatabaseSelector from "../DatabaseSelector";
import KeyTree from "../KeyTree";
import KeyViewer from "../KeyViewer";

import { Redis } from "./redis";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.redisInstance = null;
    this.state = {
      currentDatabase: 0,
      currentKey: null,
      connectError: false,
      isConnected: false,
    };
  }

  makeConnection(formData) {
    this.setState({ connectError: false });
    this.redisInstance = Redis.createClient({
      host: formData.host,
      port: formData.port
    });

    if (formData.authentication && formData.authentication.length) {
      this.redisInstance.auth(formData.authentication, (err) => {
        if (err) {
          this.setState({ connectError: true });
        }
      });
    }

    this.redisInstance.send('info', (err, result) => {
      if (err) {
        this.setSstate({ connectError: true });
      } else {
        this.setState({ isConnected: true });
      }
    });
  }

  render() {
    if (this.state.isConnected) {
      return (
        <div id="app-container" className="container">
          <DatabaseSelector
            send={ this.redisInstance.send }
            onChangeDatabase={ (id) => this.setState({ currentDatabase: id, currentKey: null }) }
          />
          <KeyTree
            send={ this.redisInstance.send }
            currentDatabase={ this.state.currentDatabase }
            onSelectKey={ (key) => this.setState({ currentKey: key }) }
          />
          <KeyViewer send={ this.redisInstance.send } currentKey={ this.state.currentKey } />
        </div>
      );
    } else {
      return (
        <div id="app-container" className="container">
          <ConnectionForm makeConnection={ (formData) => this.makeConnection(formData) } />
        </div>
      );
    }
  }
}

export default App;
