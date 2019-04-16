import * as React from 'react';
import './index.scss';

const LoadingScreen = ({ show = true, ...rest }) => (
  <div className="loading-screen" style={{ display: show ? 'flex' : 'none', ...rest.style }}>
    <div className="circle circle-1">&nbsp;</div>
    <div className="circle circle-2">&nbsp;</div>
    <div className="circle circle-3">&nbsp;</div>
    <div className="circle circle-4">&nbsp;</div>
  </div>
);

export default LoadingScreen;
