import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROLES from '../../constants/roles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <div style={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ marginRight: 20 }} >
          SIMLAB
        </Typography>
        <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.HOME}>Home</Button>
        {(authUser.roles === ROLES.WILKER || authUser.roles === ROLES.WILKERSPV) && (
          <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.WILKER_FORMUJI}>Permohonan</Button>
        )}
        {(authUser.roles === ROLES.ADMINLAB) && (
          <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.ADMINLAB}>Admin Lab</Button>
        )}
        {(authUser.roles === ROLES.ANALIS) && (
          <div>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.ANALIS}>Analis</Button>
            {/* <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.ANALIS_ALATBAHAN}>Alat Bahan</Button> */}
          </div>
        )}
        {(authUser.roles === ROLES.PELAKSANATEKNIS) && (
          <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.TEKNIS}>Pelaksana Teknis</Button>
        )}
        {authUser.roles === ROLES.ADMIN && (
          <div>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.MASTERDATASAMPLE}>Master Data Sample</Button>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.MASTERDATAPENGUJIAN}>Master Data Pengujian</Button>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.MASTERDATA_WILKER}>Master Data Wilker</Button>
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.MASTERDATA_BAHAN}>Master Data Bahan</Button>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.ACCOUNT}>Account</Button>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.ADMIN}>Admin</Button>
            <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.MASTERDATA_USERFORM}>User Form</Button>
          </div>
        )}
        <SignOutButton />
      </Toolbar>
    </AppBar>
  </div>
);

const NavigationNonAuth = () => (
  <div style={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ marginRight: 20 }} >
          SIMLAB
        </Typography>
        <Button color="inherit" style={{ marginRight: 5 }} component={Link} to={ROUTES.SIGN_IN}>Sign In</Button>
      </Toolbar>
    </AppBar>
  </div>
);

export default Navigation;
