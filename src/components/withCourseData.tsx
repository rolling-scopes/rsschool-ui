import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import { NextContext } from 'next';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export interface Course {
  id: number;
  name: string;
  alias: string;
}

function withCourseData(WrappedComponent: React.ComponentType<any>) {
  return class extends React.PureComponent<{ course?: Course }> {
    static async getInitialProps(context: NextContext) {
      const alias = context.query.course;
      const courses = await fetch(`${serverRuntimeConfig.rsHost || ''}/api/courses`);
      if (courses.ok) {
        const course = (await courses.json()).data.find((c: any) => c.alias === alias);
        return { course };
      }
      return {};
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
