import * as React from 'react';
import axios from 'axios';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

function withCourses(WrappedComponent: React.ComponentType<any>) {
  return class extends React.PureComponent {
    static async getInitialProps() {
      try {
        const coursesResponse = await axios(`${serverRuntimeConfig.rsHost || ''}/api/courses`);
        const courses = coursesResponse.data.data;
        return { courses };
      } catch (e) {
        return {};
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withCourses;
