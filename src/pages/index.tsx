import * as React from 'react';
import Router from 'next/router';

export default class extends React.Component {
  static async getInitialProps({ res }: any) {
    if (res) {
      res.writeHead(302, {
        Location: '/task-score',
      });
      res.end();
    } else {
      Router.push('/task-score');
    }
    return {};
  }
}
