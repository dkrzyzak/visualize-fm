import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import TopBar from './components/Navbar';
import Top100Layout from './modules/Top100Layout';

function App() {
	return (
		<BrowserRouter>
			<div className='App'>
				<Container>
					<TopBar />
					<Switch>
						<Route exact path='/'>
							<Top100Layout />
						</Route>
					</Switch>
				</Container>
			</div>
		</BrowserRouter>
	);
}

export default App;
