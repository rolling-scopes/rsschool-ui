import * as React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import './index.scss';

class Profile extends React.Component<any, any> {
    render() {
        return (
            <form>
                <div className="row">
                    <FormGroup className="col-md-6">
                        <Label>First Name</Label>
                        <Input placeholder="First Name" className="form-control" />
                    </FormGroup>
                    <FormGroup className="col-md-6">
                        <Label>Last Name</Label>
                        <Input placeholder="Last Name" className="form-control" />
                    </FormGroup>
                </div>
                <hr className="mb-5 mt-5" />
                <div className="row">
                    <FormGroup className="col-md-12">
                        <Label>Email</Label>
                        <Input placeholder="Email" className="form-control" />
                    </FormGroup>
                </div>
            </form>
        );
    }
}

export default Profile;
