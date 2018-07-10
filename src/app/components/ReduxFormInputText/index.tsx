import * as React from 'react';
import { WrappedFieldProps, GenericFieldHTMLAttributes } from 'redux-form';
import { Label, Input, FormFeedback } from 'reactstrap';

const ReduxFormInput = ({
    input,
    label,
    placeholder,
    meta: { touched, error, warning },
}: GenericFieldHTMLAttributes & WrappedFieldProps) => (
    <React.Fragment>
        {label ? <Label>{label}</Label> : null}
        <Input
            {...input}
            type="text"
            placeholder={placeholder}
            valid={touched ? !error : undefined}
            invalid={touched ? !!error : undefined}
        />
        {touched ? (
            <React.Fragment>
                {error ? <FormFeedback>{error}</FormFeedback> : null}
                {warning ? <FormFeedback valid={true}>{warning}</FormFeedback> : null}
            </React.Fragment>
        ) : null}
    </React.Fragment>
);
export default ReduxFormInput;
