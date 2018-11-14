import React from "react";
import PropTypes from "prop-types";

class KeyTree extends React.Component {
  static propTypes = {
    currentDatabase: PropTypes.integer,
    send: PropTypes.func,
    onSelectKey: PropTypes.func
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
    let lastTree, lastKey;

    const subKeyToTree = (subkey) => {
      if (!lastTree[subkey]) {
        lastTree[subkey] = {
          fullKey: `${ lastKey }${subkey}`,
          key: subkey,
          children: {}
        }
      }

      lastKey += `${ subkey }:`;
      lastTree = lastTree[subkey].children;
    };

    const keyToTree = (key) => {
      lastTree = tree;
      lastKey = "";

      key.split(":").forEach(subKeyToTree);
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

  handleClick(key, childrenLength) {
    if (childrenLength > 0) {
      let newExpansions = { ...this.state.expanded };

      if (newExpansions[key]) {
        delete newExpansions[key];
      } else {
        newExpansions[key] = true;
      }

      this.setState({ expanded: newExpansions });
    } else {
      if (this.props.onSelectKey) {
        this.props.onSelectKey(key);
      }
    }
  }

  renderTree(children, margin = 0) {
    return Object.keys(children).map((key) => {
      const current = children[key];
      const childrenLength = Object.keys(current.children).length;
      const keyName = `${ current.key } ${ childrenLength > 0 ? `(${ childrenLength })` : ""}`;

      let childrenContainer = null;

      if (this.state.expanded[current.fullKey]) {
        childrenContainer = (
          <div>
            { this.renderTree(current.children, margin + 10) }
          </div>
        );
      }

      return (
        <div key={ `tree.${ current.fullKey }` } style={{ marginLeft: `${ margin }px` }}>
          <div onClick={ () => this.handleClick(current.fullKey, childrenLength) }>{ keyName }</div>
          { childrenContainer }
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
