import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Request from 'superagent';
import App from './views/App.jsx';
import Welcome from './views/Welcome.jsx';
import Login from './components/login/index.jsx';

injectTapEventPlugin();

const muiTheme = getMuiTheme(lightBaseTheme, {
	appBar: {
		color: '#202D3E'
	},
	palette: {
		primary1Color: '#202D3E'
	},
	datePicker: {
		color: '#202D3E'
	},
	flatButton: {
		primaryTextColor: '#202D3E'
	},
	floatingActionButton: {
		color: '#202D3E'
	},
	inkBar: {
		backgroundColor: '#202D3E'
	},
	radioButton: {
		checkedColor: '#202D3E'
	},
	raisedButton: {
		primaryColor: '#202D3E',
		primaryTextColor: '#DDDDDD'
	},
	slider: {
		rippleColor: '#202D3E',
		selectionColor: '#202D3E'
	},
	textField: {
		focusColor: '#202D3E'
	},
	toggle: {
		thumbOnColor: '#202D3E'
	}
});

console.log('muiTheme', muiTheme);

var user;

let requireAuth = function(nextState, replace, callback) {
  const token = localStorage.getItem('token')
  if (!token) {
  	replace('/')
  	return callback();
  }
  else {
  	Request
  		.get('/dashboard/user')
  		.set({'Authorization': token})
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					user = res.body
					return callback()
				}
			})
  }
}

let alreadyLoggedIn = function(nextState, replace, callback) {
  const token = localStorage.getItem('token')
  if(token)
  	replace('/app')
  return callback()
}
let canAccess = function (nextState, replace, callback) {
	if(user) {
		if(user.actions.indexOf('Roles') < 0)
			replace('/app')
	}
	return callback()
}

ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Router history={hashHistory}>
			<Route path="/" component={Welcome} onEnter={alreadyLoggedIn} />
			<Route path="/login" component={Login} onEnter={alreadyLoggedIn} />
      <Route path="/product/:name" component={ProductProfile} />
      <Route path="/candidate/:id" component={CandidateProfile} />
			<Route path="/app" component={(props)=><App user={user} children={props.children}/>} onEnter={requireAuth} >
				<IndexRoute component={() => <Dashboard user={user} />} />
				<Route path="/roles" component={Roles} />
				<Route path="/users" component={Users} />
				<Route path="/candidates" component={Candidates} />
				<Route path="/programflow" component={ProgramFlow} />
				<Route path="/projects" component={() => <Projects user={user}/>} />
				<Route path="/feedback" component={Feedback} />
			</Route>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root")
);
