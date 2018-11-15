import React from "react"
import PropTypes from "prop-types";

class KeyViewer extends React.Component {
  state = {
    send: PropTypes.func,
    currentKey: this.props.currentKey,
    dataRetrived: false,
    dataType: null,
    data: null
  };

  componentDidMount() {
    this.loadKeyData();
  }

  componentDidUpdate() {
    if (this.props.currentKey !== this.state.currentKey) {
      this.setState({ currentKey: this.props.currentKey }, () => {
        this.loadKeyData();
      });
    }
  }

  loadKeyData() {
    if (!this.state.currentKey) {
      return;
    }

    this.setState({
      dataRetrived: false,
      data: null,
      dataType: null
    });

    this.props.send("type", [this.state.currentKey], (err, result) => {
      if (err) {
        // TODO: Add error handler
      } else {
        this.setState({ dataType: result });

        if (["set", "list", "hash"].indexOf(result) !== -1) {
          if (result === "set") {
            this.loadSet();
          } else if (result === "list") {
            this.loadList();
          } else {
            this.loadHash();
          }
        } else {
          this.loadStringValue();
        }
      }
    });
  }

  loadSet(cursor = 0) {
    this.props.send('sscan', [this.state.currentKey, cursor], (err, result) => {
      if (err) {
        // TODO: Add error handler
      } else {
        this.setState({ data: [].concat(this.state.data || [], result[1]) } ,() => {
          if (result[0] !== "0") {
            this.loadSet(result[0]);
          } else {
            this.setState({ dataRetrived: true });
          }
        });
      }
    });
  }

  loadList() {
    // TODO: maybe a pagina is a good idea due large listss
    this.props.send('lrange', [this.state.currentKey, 0, -1], (err, result) => {
      this.setState({ dataRetrived: true, data: result });
    });
  }

  loadHash(cursor = 0 ) {
    this.props.send('hscan', [this.state.currentKey, cursor], (err, result) => {
      if (err) {
        // TODO: Add error handler
      } else {
        let hashes = [];

        for(var i = 0; i < result[1].length; i+= 2) {
          hashes.push({ key: result[1][i], value: result[1][i + 1] });
        }

        console.log(hashes);

        this.setState({ data: [].concat(this.state.data || [], hashes) } ,() => {
          if (result[0] !== "0") {
            this.loadSet(result[0]);
          } else {
            this.setState({ dataRetrived: true });
          }
        });
      }
    });
  }

  loadStringValue() {
    this.props.send("get", [this.state.currentKey], (err, result) => {
      this.setState({ dataRetrived: true, data: result });
    });
  }

  renderData() {
    const { dataType, data } = this.state;

    if (this.state.currentKey) {
      if (this.state.dataRetrived) {
        if (dataType === "string") {
          return data;
        } else if(dataType === "set") {
          return data.map((item, i) => {
            return (
              <div key={ `keyData.${i}` }>{ item }</div>
            );
          });
        } else if(dataType === "list") {
          return data.map((item, i) => {
            return  (
              <div key={ `keyData.${i}` }>
                <div>{ i }</div>
                <div>{ item }</div>
              </div>
            );
          });
        } else {
          return data.map((item, i) => {
            return (
              <div key={ `keyData.${i}` }>
                <div>{ item.key }</div>
                <div>{ item.value }</div>
              </div>
            );
          });
        }
      } else {
        return "Obtaining data...";
      }
    } else {
      return "No key selected";
    }
  }

  render() {
    return (
      <div>{ this.renderData() }</div>
    );
  }
};

export default KeyViewer;
