import React from 'react';
import '../src/styles/main.scss';

const GlobalDecorator = props => <div>{props.children}</div>;

export function GlobalStorybookDecorator(storyFn) {
    return <GlobalDecorator>{storyFn()}</GlobalDecorator>;
}
