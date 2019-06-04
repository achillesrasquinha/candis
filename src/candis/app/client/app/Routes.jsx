import React        from 'react'
import { Route, Switch }    from 'react-router-dom'

import config       from './config'
import PrivateRoute from './component/PrivateRoute'
import App          from './component/App'
import SignIn       from './page/SignIn'
import SignUp       from './page/SignUp'
import ResetPassword from './page/ResetPassword'
import ForgotPassword from './page/ForgotPassword'

const Routes = (
  <div>
    <PrivateRoute
           path={config.routes.base}
           exact
    	component={App}/>
    <Route
    		   path={config.routes.signin}
      component={SignIn}/>
    <Route
      path={config.routes.signup}
      component={SignUp}/>
    <Route
      path={config.routes.forgotPassword}
      component={ForgotPassword}/>
    <Route
      path={config.routes.resetPassword}
      component={ResetPassword}
    />
  </div>
)

export default Routes
