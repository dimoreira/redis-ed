import React from "react";
import { FormGroup, InputGroup } from "@blueprintjs/core";

class ConnectionForm extends React.Component {
  render() {
    return (
      <div className="col-xs-12 col-lg-4 col-lg-offset-4">
        <FormGroup
            helperText="Helper text with details..."
            label="Label A"
            labelFor="text-input"
            labelInfo="(required)"
        >
            <InputGroup id="text-input" placeholder="Placeholder text" />
        </FormGroup>
      </div>
    );
  }
}

export default ConnectionForm;
