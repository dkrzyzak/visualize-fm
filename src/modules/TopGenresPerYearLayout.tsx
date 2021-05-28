import React, { useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { Slider } from 'react-rainbow-components';
import localAxios from '../axios';
import AsyncWrapper from '../components/AsyncWrapper';
import BumpChart from '../components/BumpChart';
import { formatTopGenresForChart } from './helpers';
import { TopGenresPerYear } from './types';

const TopGenresPerYearLayout: React.FC = () => {
	const [year, setYear] = useState(2020);
	const [isFetching, setFetching] = useState(false);
	const [topGenresList, setTopList] = useState<TopGenresPerYear[]>([]);

	const getTopGenresStartingYear = async () => {
		setFetching(true);
		try {
			const { data } = await localAxios.get<TopGenresPerYear[]>(`/topGenresPerYear/${year}`);
			setTopList(data);
		} catch (error) {
			return [];
		} finally {
			setFetching(false);
		}
	};

	const onChangeYear = (event: React.ChangeEvent<HTMLInputElement>) => {
		setYear(+event.target.value);
	};

	return (
		<Container>
			<Jumbotron style={{ padding: '3rem 2rem' }}>
				<h1>Jak zmieniały się najpopularniejsze gatunki?</h1>
				<h6>Wybierz rok, i zobacz jak preferencje użytkowników zmieniały na przestrzeni 5 lat od wybranego roku</h6>
			</Jumbotron>

			<Row>
				<Col xs={8}>
					<Slider label='Wybierz rok' min={1960} max={1965} step={1} value={year} onChange={onChangeYear} />
				</Col>
				<Col xs={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
					<Button onClick={getTopGenresStartingYear}>Pobierz dane!</Button>
				</Col>
			</Row>

			<AsyncWrapper isFetching={isFetching}>
				{topGenresList.length > 0 && (
					<div>
						<BumpChart data={formatTopGenresForChart(topGenresList)} />
					</div>
				)}
			</AsyncWrapper>
		</Container>
	);
};

export default TopGenresPerYearLayout;
