import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import TopBar from './components/Navbar';
import Hot100Layout from './modules/Hot100Layout';
import TopGenresPerYearLayout from './modules/TopGenresPerYearLayout';

function App() {
	return (
		<BrowserRouter>
			<div className='App'>
				<Container>
					<TopBar />
					<Switch>
						<Route exact path='/'>
							<Redirect to='/hot100' />
						</Route>
						<Route path='/hot100'>
							<Hot100Layout />
						</Route>
						<Route path='/top-genres'>
							<TopGenresPerYearLayout />
						</Route>
					</Switch>
				</Container>
			</div>
		</BrowserRouter>
	);
}

export default App;
