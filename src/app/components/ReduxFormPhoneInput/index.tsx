import * as React from 'react';
import { Input } from 'reactstrap';

const ReduxFormPhoneInput = ({ input, placeholder, pattern }: any) => (
    <Input type="tel" pattern={pattern} placeholder={placeholder} {...input} />
);

export default ReduxFormPhoneInput;
