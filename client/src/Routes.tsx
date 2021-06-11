import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import ProtectedRoute from './ProtectedRoute';
import Main from './pages/Main/Main';
import Payment from './pages/Payment/Payment';

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} />
      <ProtectedRoute exact path="/settings" component={Settings} />
      <Route exact path="/payment" component={Payment} />
    </Switch>
  );
};

export default Routes;
