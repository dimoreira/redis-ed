import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./context";

class Form extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.providerDefaults = {
      getValueFor: name => this.state.values[name],
      setValueFor: (name) => {
        return (e) => {
          let newValue = {}
          newValue[name] = e.target.value;

          this.setState({
            values: {
              ...this.state.values,
              ...newValue
            }
          });
        }
      }
    };

    this.state = {
      ...{ values: {} },
      ...(props.defaults ? { values: props.defaults } : {})
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.values);
    }
  }

  render() {
    return (
      <FormContext.Provider value={ this.providerDefaults }>
        <form { ...this.props } onSubmit={ (e) => this.handleSubmit(e) } />
      </FormContext.Provider>
    );
  }
}

export default Form;
