import { shallow } from 'enzyme';
import * as React from 'react';
import Home from './index';
const { __stateGetter } = require('react-redux');

const noop = () => {};

describe('Home', () => {
    beforeEach(() => {
        __stateGetter.mockImplementation(() => ({}));
    });

    it('renders correctly if no data', () => {
        const output = shallow(<Home fetchFeed={noop} feed={[]} />);
        expect(output).toMatchSnapshot();
    });
});
