import ReduxFormInput from 'components/ReduxFormInput';
import * as React from 'react';
import { FormGroup, Label } from 'reactstrap';
import { Field } from 'redux-form';

class NamesForm extends React.PureComponent<any, any> {
    render() {
        return [
            <div key="1" className="row">
                <FormGroup className="col-md-6">
                    <Label>First Name (as it appears on your passport)</Label>
                    <Field name="firstName" placeholder="First Name" component={ReduxFormInput} type="text" />
                </FormGroup>
                <FormGroup className="col-md-6">
                    <Label>Last Name (as it appears on your passport)</Label>
                    <Field name="lastName" placeholder="Last Name" component={ReduxFormInput} type="text" />
                </FormGroup>
            </div>,
            <div key="2" className="row">
                <FormGroup className="col-md-6">
                    <Label>First Name (in Russian)</Label>
                    <Field name="firstNameNative" placeholder="First Name" component={ReduxFormInput} type="text" />
                </FormGroup>
                <FormGroup className="col-md-6">
                    <Label>Last Name (in Russian)</Label>
                    <Field name="lastNameNative" placeholder="Last Name" component={ReduxFormInput} type="text" />
                </FormGroup>
            </div>,
        ];
    }
}

export default NamesForm;
