import * as React from 'react';
import axios from 'axios';
import { NextContext } from 'next';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export interface Course {
  id: number;
  name: string;
  alias: string;
  completed: boolean;
}

function withCourseData(WrappedComponent: React.ComponentType<any>) {
  return class extends React.PureComponent<{ course?: Course }> {
    static async getInitialProps(context: NextContext) {
      try {
        const alias = context.query.course;
        const courses = await axios(`${serverRuntimeConfig.rsHost || ''}/api/courses`);
        const course = courses.data.data.find((c: any) => c.alias === alias);
        return { course };
      } catch (e) {
        return {};
      }
    }

    render() {
      if (!this.props.course) {
        return <div>No Data</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withCourseData;
