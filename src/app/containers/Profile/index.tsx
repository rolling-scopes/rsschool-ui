import ProfileForm from 'components/ProfileForm';
import { fetchProfile, updateProfile } from 'core/actions';
import { IProfile } from 'core/models';
import { RootState } from 'core/reducers';
import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';

type ProfileProps = {
    load: () => void;
    submit: (formData: any) => void;
    formData: any;
};

const mapStateToProps = (state: RootState, props: ProfileProps): ProfileProps => {
    return {
        ...props,
        formData: state.user.profile,
    };
};

const mapDispatchToProps = (dispatch: any, props: ProfileProps): ProfileProps => {
    return {
        ...props,

        submit: (data: IProfile) => {
            dispatch(updateProfile(data));
        },
        load: () => {
            dispatch(fetchProfile());
        },
    };
};

class Profile extends React.Component<ProfileProps> {
    componentDidMount() {
        this.props.load();
    }

    handleSubmit = (formData: any) => {
        this.props.submit(formData);
    };

    render() {
        return <ProfileForm initialValues={this.props.formData} onSubmit={this.handleSubmit} />;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Profile);
