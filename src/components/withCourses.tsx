import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

function withCourses(WrappedComponent: React.ComponentType<any>) {
  return class extends React.PureComponent {
    static async getInitialProps() {
      console.log(serverRuntimeConfig);
      const coursesResponse = await fetch(`${serverRuntimeConfig.rsHost || ''}/api/courses`);
      if (coursesResponse.ok) {
        const courses = (await coursesResponse.json()).data;
        return { courses };
      }
      return {};
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withCourses;
