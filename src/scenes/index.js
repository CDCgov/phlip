import React from 'react'
import { Route } from 'react-router-dom'
import Home from './Home'

const Scenes = () => {
  return (
    <Route path="/" component={Home} />
  );
};

export default Scenes;