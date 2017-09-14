import React, { Component } from 'react';
import PropTypes  from 'prop-types';


// App's children
class App extends Component {
  render() {
    return (
      <div>
        La la la la
        { React.Children.toArray(this.props.children) }
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
};

export default App;
