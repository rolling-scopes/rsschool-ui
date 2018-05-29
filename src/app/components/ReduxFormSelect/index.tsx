import * as React from 'react';
import { Input } from 'reactstrap';

const ReduxFormSelect = ({ input, children }: any) => (
    <Input type="select" {...input}>
        {children}
    </Input>
);

export default ReduxFormSelect;
