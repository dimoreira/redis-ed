import React from 'react';
import ConnectionForm from "../ConnectionForm";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false
    }
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
          <div className="row">
            <ConnectionForm />
          </div>
        </div>
      );
    }
  }
}

export default App;
