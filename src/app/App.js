import React from 'react';
import PropTypes  from 'prop-types';

const App = ({ children }) => {
  return (
    <div>
      La la la la
      { React.Children.toArray(children) }
    </div>
  );
};

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
};

export default App;
