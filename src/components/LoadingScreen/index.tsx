import * as React from 'react';
import './index.scss';

export const LoadingScreen = (props: any) => {
  if (!props.show) {
    return <>{props.children}</>;
  }
  return (
    <div className="loading-screen" style={{ display: props.show ? 'flex' : 'none', style: props.style }}>
      <div className="circle circle-1">&nbsp;</div>
      <div className="circle circle-2">&nbsp;</div>
      <div className="circle circle-3">&nbsp;</div>
      <div className="circle circle-4">&nbsp;</div>
    </div>
  );
};
