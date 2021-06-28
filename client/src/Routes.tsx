import { lazy, Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Spinner from './components/Spinner/Spinner';
import ProtectedRoute from './ProtectedRoute';
import AuthNavbar from './components/AuthNavbar/Navbar';
import { useAuth } from './context/useAuthContext';

const Main = lazy(() => import('./pages/Main/Main'));
const Login = lazy(() => import('./pages/Login/Login'));
const Signup = lazy(() => import('./pages/SignUp/SignUp'));
const ProfileListings = lazy(() => import('./pages/ProfileListings/ProfileListings'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Messages = lazy(() => import('./pages/Messages/index'));
const ProfileDetails = lazy(() => import('./pages/ProfileDetails/ProfileDetails'));

const Routes = (): JSX.Element => {
  const { loggedInUser } = useAuth();
  return (
    <>
      {loggedInUser && <AuthNavbar />}
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <ProtectedRoute exact path="/dashboard" component={ProfileListings} />
          <ProtectedRoute exact path="/settings" component={Settings} />
          <ProtectedRoute exact path="/messages" component={Messages} />
          <ProtectedRoute path="/dashboard/:userId" component={ProfileDetails} />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

export default Routes;
