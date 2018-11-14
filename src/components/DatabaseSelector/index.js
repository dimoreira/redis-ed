import React from "react";
import PropTypes from "prop-types";

class DatabaseSelector extends React.Component {
  static propTypes = {
    send: PropTypes.func,
    onChangeDatabase: PropTypes.func
  };

  state = {
    currentDatabase: 0,
    databases: 0
  };

  componentDidMount() {
    this.props.send("config", ["get", "databases"], (err, result) => {
      if (err) {
        // TODO: Add error handler
      } else {
        this.setState({
          databases: result[1]
        });
      }
    });
  }

  selectDatabase(databaseId) {
    this.setState({ currentDatabase: databaseId });
    this.props.send("select", [databaseId], (err, result) => {
      if (err) {
        // TODO: Add error handler
      } else {
        if (this.props.onChangeDatabase) {
          this.props.onChangeDatabase(databaseId);
        }
      }
    });
  }

  renderDatabases() {
    let options = [];

    for (var db = 0; db < this.state.databases; db++) {
      options.push(<option value={ db } key={ db }>DB: { db }</option>);
    }

    return options;
  }

  render() {
    return (
      <select onChange={ (e) => this.selectDatabase(e.target.value) }>
        { this.renderDatabases() }
      </select>
    );
  }
}

export default DatabaseSelector;
