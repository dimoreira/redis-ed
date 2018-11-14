import React from 'react';
import ConnectionForm from "../ConnectionForm";

import { RedisContext } from "./context";
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

    this.redisContextDefaults = {
      makeConnection: (formData) => {
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
    };
  }

  render() {
    if (this.state.isConnected) {
      return (
        <RedisContext.Provider value={{ ...this.state, ...this.redisContextDefaults }}>
          <div id="app-container" className="container">

          </div>
        </RedisContext.Provider>
      );
    } else {
      return (
        <RedisContext.Provider value={{ ...this.state, ...this.redisContextDefaults }}>
          <div id="app-container" className="container">
            <ConnectionForm />
          </div>
        </RedisContext.Provider>
      );
    }
  }
}

export default App;
