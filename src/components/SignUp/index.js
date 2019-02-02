import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import * as ROLES from '../../constants/roles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignUpPage = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', margin: 10}}>
    <Paper style={{padding: 10, width: 300}}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <SignUpForm />
    </Paper>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;

    const roles = [];
    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            roles,
            area: '9999',
          });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="username"
          // value={username}
          onChange={this.onChange}
          // type="text"
          label="Full Name"
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="email"
          // value={email}
          onChange={this.onChange}
          // type="text"
          label="Email Address"
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="passwordOne"
          // value={passwordOne}
          onChange={this.onChange}
          type="password"
          label="Password"
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="passwordTwo"
          // value={passwordTwo}
          onChange={this.onChange}
          type="password"
          label="Confirm Password"
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <label>
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
          </label>
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <Typography variant="button" gutterBottom>
    Tidak punya akun? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </Typography>
  // <p>
  //   Tidak punya akun? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  // </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };