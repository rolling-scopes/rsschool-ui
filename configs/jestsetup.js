const React = require('react');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
// import Enzyme, { shallow, render, mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

process.env.TEST = true;

// apply React 16 adapter
Enzyme.configure({ adapter: new Adapter() });

// Enzyme methods save to global
global.shallow = Enzyme.shallow;
global.render = Enzyme.render;
global.mount = Enzyme.mount;

jest.mock('react-redux', () => require('./test-helpers/redux')());

jest.mock('react-dom', () => {
    const __portalNodes = [];
    return {
        ...require.requireActual('react-dom'),
        __portalNodes,
        createPortal: jest.fn((el, node) => {
            if (!__portalNodes.find(portalNode => node === portalNode)) {
                __portalNodes.push(node);
            }
            return el;
        }),
    };
});

global.Element.prototype.querySelector = jest.fn(() => ({
    focus: jest.fn(),
    setAttribute: jest.fn(),
}));

const _Date = Date;
const MOCK_TIME = 1514764800000;
global.Date = jest.fn((...args) => (args.length ? new _Date(...args) : new _Date(MOCK_TIME)));
global.Date.now = jest.fn(() => MOCK_TIME);

global.localStorage = (() => {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, data) {
            store[key] = data.toString();
        },
        clear() {
            store = {};
        },
    };
})();
