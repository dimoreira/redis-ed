import React from "react";
import PropTypes from "prop-types";

import Form from "../Form";
import FormControl from "../FormControl";

import "./index.sass";

class ConnectionForm extends React.Component {
  static propTypes = {
    makeConnection: PropTypes.func
  };

  state = {
    defaults: {
      host: "127.0.0.1",
      port: 6379
    }
  };

  render() {
    return (
      <Form className="col-xs-12 col-lg-4" id="connection-form" defaults={ this.state.defaults } onSubmit={ this.props.makeConnection }>
        <FormControl label="Host" name="host" type="text" />
        <FormControl label="Port" name="port" type="number" />
        <hr />
        <FormControl label="Authentication" helpText="Leave blank if none" name="authentication" type="text" />
        <input type="submit" value="Connect" />
      </Form>
    );
  }
}

export default ConnectionForm;
