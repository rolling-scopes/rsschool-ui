import * as React from 'react';
import { Button } from 'reactstrap';
import { InjectedFormProps, reduxForm } from 'redux-form';
import ContactsForm from './ContactsForm';
import EducationForm from './EducationForm';
import NamesForm from './NamesForm';

const ProfileForm = (props: InjectedFormProps) => {
    const { handleSubmit, pristine, submitting } = props;
    return (
        <form onSubmit={handleSubmit}>
            <NamesForm />

            <hr className="mb-5 mt-5" />

            <ContactsForm />

            <hr className="mb-5 mt-5" />

            <EducationForm />

            <div className="row text-center">
                <div className="form-group col-md-12">
                    <Button color="success" type="submit" disabled={pristine || submitting}>
                        Save Information
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default reduxForm({
    form: 'profileForm',
})(ProfileForm);
