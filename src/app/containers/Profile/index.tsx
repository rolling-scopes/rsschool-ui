import { fetchProfile, updateProfile } from 'core/actions';
import * as React from 'react';
import { connect } from 'react-redux';
import ProfileForm from '../../components/profile-form';
import { IProfile } from '../../core/models';
import { RootState } from '../../core/reducers';
import './index.scss';

type ProfileProps = {
    load: any;
    submit: any;
    data: any;
};

const mapStateToProps = (state: RootState, props: ProfileProps): ProfileProps => {
    return {
        ...props,
        data: state.profile.data,
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

    handleSubmit(values: any) {
        this.props.submit(values);
    }

    render() {
        return <ProfileForm initialValues={this.props.data} onSubmit={data => this.handleSubmit(data)} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
