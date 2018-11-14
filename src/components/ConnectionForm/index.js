import React from "react";

import Form from "../Form";
import FormControl from "../FormControl";
import { RedisContext } from "../App/context";

import "./index.sass";

class ConnectionForm extends React.Component {
  static contextType = RedisContext;

  state = {
    defaults: {
      host: "127.0.0.1",
      port: 6379
    }
  };

  render() {
    return (
      <Form className="col-xs-12 col-lg-4" id="connection-form" defaults={ this.state.defaults } onSubmit={ this.context.makeConnection }>
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
