import React, { useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { Slider } from 'react-rainbow-components';
import { getTopGenresForYear } from './helpers';

const TopGenresPerYearLayout: React.FC = () => {
	const [year, setYear] = useState(2020);

	const getData = async () => {
		const a = await getTopGenresForYear(year);
		console.log(a);
	};

	const onChangeYear = (event: React.ChangeEvent<HTMLInputElement>) => {
		setYear(+event.target.value);
	};

	return (
		<Container>
			<Jumbotron style={{ padding: '3rem 2rem' }}>
				<h1>Najpopularniejsze gatunki</h1>
				<h6>Jaki gatunek najczęściej zdobywa listy w danym roku?</h6>
			</Jumbotron>

			<Row>
				<Col xs={8}>
					<Slider label='Wybierz rok' min={2000} max={2021} step={1} value={year} onChange={onChangeYear} />
				</Col>
				<Col xs={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
					<Button onClick={getData}>Pobierz dane!</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default TopGenresPerYearLayout;
