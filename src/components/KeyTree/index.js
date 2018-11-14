import React from "react";
import PropTypes from "prop-types";

class KeyTree extends React.Component {
  static propTypes = {
    send: PropTypes.func,
    currentDatabase: PropTypes.integer
  };

  state = {
    currentDatabase: this.props.currentDatabase,
    scanning: false,
    keys: [],
    tree: {},
    expanded: {}
  };

  loadKeys(lastCursor = 0)  {
    if (lastCursor === 0) {
      this.setState({
        scanning: true,
        keys: [],
        tree: {},
        expanded: {}
      });
    }

    this.props.send("scan", [lastCursor], (err, result) => {
      this.setState({ keys: [].concat(this.state.keys, result[1]) }, () => {
        if (parseInt(result[0]) !== 0) {
          this.loadKeys(result[0]);
        } else {
          this.setState({ scanning: false });
          this.keysToTree();
        }
      });
    });
  }

  keysToTree() {
    let tree = {};
    let lastTree = null;

    const subKeyToTree = (subkey) => {
      if (!lastTree[subkey]) {
        lastTree[subkey] = {
          fullKey: (lastTree.fullKey || "") + subkey + ":",
          key: subkey,
          children: {}
        }
      }

      lastTree = lastTree[subkey].children;
    };

    const keyToTree = (key) => {
      lastTree = tree;
      key.split(":").forEach((subkey) => subKeyToTree(subkey));
    };

    this.state.keys.forEach(keyToTree);
    this.setState({ tree: tree });
  }

  componentDidMount() {
    this.loadKeys();
  }

  componentDidUpdate() {
    if (this.props.currentDatabase !== this.state.currentDatabase) {
      this.setState({ currentDatabase: this.props.currentDatabase }, () => {
        this.loadKeys();
      });
    }
  }

  toggleExpand(key) {
    let newExpansions = { ...this.state.expanded };

    if (newExpansions[key]) {
      delete newExpansions[key];
    } else {
      newExpansions[key] = true;
    }

    this.setState({ expanded: newExpansions });
  }

  renderTree(children, margin = 0) {
    return Object.keys(children).map((key) => {
      const current = children[key];

      return (
        <div key={ `tree.${ current.fullKey }` } style={{ marginLeft: `${ margin }px` }}>
          <div onClick={ () => this.toggleExpand(current.fullKey) }>{ current.key } ({ Object.keys(current.children).length })</div>
          <div style={{ display: this.state.expanded[current.fullKey] ? "block" : "none" }}>
            { this.renderTree(current.children, margin + 10) }
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        { this.renderTree(this.state.tree) }
      </div>
    );
  }
}

export default KeyTree;
