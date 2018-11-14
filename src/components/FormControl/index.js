import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "../Form/context";

import "./index.sass";

class FormControl extends React.Component {
  static contextType = FormContext;
  static propTypes = {
    helpText: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'hidden', 'number'])
  };

  constructor(props) {
    super(props);

    this.state = {
      componentType: props.type[0].toUpperCase() + props.type.substr(1)
    };
  }

  renderNumber() {
    return (
      <input type="text" name={ this.props.name } value={ this.context.getValueFor(this.props.name) } onChange={ this.context.setValueFor(this.props.name) } />
    );
  }

  renderText() {
    return (
      <input type="text" name={ this.props.name } value={ this.context.getValueFor(this.props.name) } onChange={ this.context.setValueFor(this.props.name) } />
    )
  }

  renderPassword() {
    return (
      <input type="password" name={ this.props.name } />
    )
  }

  renderHelpText() {
    const { helpText } = this.props;

    if (helpText) {
      return (
        <sub>{ helpText }</sub>
      );
    }
  }

  render() {
    return (
      <div className="form-group">
        <label>{ this.props.label }</label>
        { this[`render${ this.state.componentType }`]() }
        { this.renderHelpText() }
      </div>
    );
  }
};

export default FormControl;
