import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import { NextContext } from 'next';

export interface Course {
  id: number;
  name: string;
  alias: string;
}

function withCourseAlias(WrappedComponent: React.ComponentType<any>) {
  return class extends React.Component<{ course?: Course }> {
    static async getInitialProps(context: NextContext) {
      const alias = context.query.course;
      const courses = await fetch(`${process.env.RS_HOST}/api/courses`);
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

export default withCourseAlias;
