import ReduxFormSelect from 'components/ReduxFormSelect';
import * as React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Label } from 'reactstrap';
import { Field } from 'redux-form';
import { EDUCATION_YEARS, EMPTY_FACULTY, UNIVERSITIES } from '../../reference-data';

function mapStateToProps(state: any) {
    return {
        university: state.form.profileForm.values
            ? state.form.profileForm.values.primaryEducation.university
            : undefined,
    };
}

class EducationForm extends React.PureComponent<any, any> {
    render() {
        const faculties = this.getFaculties();
        return [
            <div key="1" className="row">
                <FormGroup className="col-md-12">
                    <Label>Your University</Label>
                    <Field
                        name="primaryEducation.university"
                        className="form-control"
                        placeholder="Your University"
                        component={ReduxFormSelect}
                    >
                        {UNIVERSITIES.map(university => (
                            <option key={university.id} value={university.id}>
                                {university.name}
                            </option>
                        ))}
                    </Field>
                </FormGroup>
            </div>,
            <div key="2" className="row">
                <FormGroup className="col-md-9">
                    <Label>Your Faculty</Label>
                    <Field
                        name="primaryEducation.faculty"
                        className="form-control"
                        placeholder="Your Faculty"
                        component={ReduxFormSelect}
                    >
                        {faculties.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                            </option>
                        ))}
                    </Field>
                </FormGroup>
                <FormGroup className="col-md-3">
                    <Label>Graduation Year</Label>
                    <Field
                        name="primaryEducation.graduationYear"
                        className="form-control"
                        placeholder="Graduation Year"
                        component={ReduxFormSelect}
                    >
                        {EDUCATION_YEARS.map(year => (
                            <option key={year.id} value={year.id}>
                                {year.name}
                            </option>
                        ))}
                    </Field>
                </FormGroup>
            </div>,
        ];
    }

    private getFaculties() {
        const university = UNIVERSITIES.find((university: any) => university.id === this.props.university);
        return university ? university.faculties : [EMPTY_FACULTY];
    }
}

export default connect(
    mapStateToProps,
    null,
)(EducationForm);
