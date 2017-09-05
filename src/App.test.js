import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('A suite', function() {
  test('should render without throwing an error', function() {
    expect(shallow(<App />).contains(<div></div>)).toBe(true);
  });
});
