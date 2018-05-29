import * as React from 'react';
import { Button, FormGroup, Label } from 'reactstrap';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import FormInput from '../redux-form-input';

const ProfileForm = reduxForm({
    form: 'profileForm',
})((props: InjectedFormProps) => {
    const { handleSubmit, pristine, submitting } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <FormGroup className="col-md-6">
                    <Label>First Name</Label>
                    <Field
                        name="givenName"
                        className="form-control"
                        placeholder="First Name"
                        component={FormInput}
                        type="text"
                    />
                </FormGroup>
                <FormGroup className="col-md-6">
                    <Label>Last Name</Label>
                    <Field
                        name="familyName"
                        placeholder="Last Name"
                        className="form-control"
                        component={FormInput}
                        type="text"
                    />
                </FormGroup>
            </div>
            <hr className="mb-5 mt-5" />
            <div className="row text-center">
                <div className="form-group col-md-12">
                    <Button color="success" type="submit" disabled={pristine || submitting}>
                        Save Information
                    </Button>
                </div>
            </div>
        </form>
    );
});

export default ProfileForm;
