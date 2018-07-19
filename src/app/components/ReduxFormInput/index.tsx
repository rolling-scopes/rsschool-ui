import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { Label, Input, FormFeedback } from 'reactstrap';

type InputType = 'text' | 'tel' | 'email' | 'date' | 'datetime-local' | 'select';

class ReduxFormInput extends React.PureComponent<React.InputHTMLAttributes<HTMLInputElement> & WrappedFieldProps> {
    render() {
        const {
            input,
            label,
            type,
            placeholder,
            pattern,
            required,
            className,
            children,
            min,
            max,
            meta: { touched, error, warning, invalid, valid },
        } = this.props;

        return (
            <React.Fragment>
                {label ? <Label className={required ? 'field-required' : ''}>{label}</Label> : null}
                <Input
                    {...input}
                    type={type as InputType}
                    placeholder={placeholder}
                    pattern={pattern}
                    required={required}
                    valid={touched && valid}
                    invalid={touched && invalid}
                    className={className}
                    min={min}
                    max={max}
                >
                    {children}
                </Input>
                {touched ? (
                    <React.Fragment>
                        {error ? <FormFeedback>{error}</FormFeedback> : null}
                        {valid && warning ? <FormFeedback valid={valid}>{warning}</FormFeedback> : null}
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        );
    }
}

export default ReduxFormInput;
