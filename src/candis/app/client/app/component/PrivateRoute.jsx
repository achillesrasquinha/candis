import React       from 'react'
import PropTypes   from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import config      from '../config'

class PrivateRoute extends Route {
	render ( ) {
		const props     = this.props
		const user      = props.user
		const Component = props.component

		return <Route render={(props) => {
			return user !== null ?
				(<Component {...props}/>)
				:
				(
					<Redirect to={{
						pathname: config.routes.signin,
						   state: { from: props.location }
					}}/>
				)
		}}/>
	}
}

PrivateRoute.propTypes    = { user: PropTypes.object }
PrivateRoute.defaultProps = { user: null }

const mapStateToProps     = (state, props) => {
	const app               = state.app

	return {
		user: app.user
	}
}

export default withRouter(connect(mapStateToProps)(PrivateRoute))
