import React from 'react';
import ConnectionForm from "../ConnectionForm";

import { Redis } from "./redis";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.redisInstance = null;
    this.state = {
      connectError: false,
      isConnected: false,
      databases: 0,
      info: null
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
        this.setState({ isConnected: true, info: result });
      }
    });
  }

  render() {
    if (this.state.isConnected) {
      return (
        <div id="app-container" className="container">

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
