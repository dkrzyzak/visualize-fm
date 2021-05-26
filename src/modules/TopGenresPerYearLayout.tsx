import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';

const TopGenresPerYearLayout: React.FC = () => {
	return (
		<Container>
			<Jumbotron style={{ padding: '3rem 2rem' }}>
				<h1>Billboard Hot 100</h1>
				<h6>Lista Billboard Hot 100 dla wybranego tygodnia oraz wykres popularności gatunków</h6>
			</Jumbotron>
		</Container>
	);
};

export default TopGenresPerYearLayout;
