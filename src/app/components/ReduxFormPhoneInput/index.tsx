import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { Input } from 'reactstrap';

const ReduxFormPhoneInput = ({
    input,
    placeholder,
    pattern,
}: WrappedFieldProps & { placeholder: string; pattern: string }) => (
    <Input type="tel" pattern={pattern} placeholder={placeholder} {...input} />
);

export default ReduxFormPhoneInput;
