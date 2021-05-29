import React, { useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { Slider } from 'react-rainbow-components';
import localAxios from '../axios';
import AsyncWrapper from '../components/AsyncWrapper';
import BumpChart from '../components/BumpChart';
import { formatTopGenresForBumpChart } from './helpers';
import { BumpChartDataItem, TopGenresPerYear } from './types';

const TopGenresPerYearLayout: React.FC = () => {
	const [year, setYear] = useState(1985);
	const [isFetching, setFetching] = useState(false);
	const [topGenresList, setTopList] = useState<BumpChartDataItem[]>([]);

	const getTopGenresStartingYear = async () => {
		setFetching(true);
		try {
			const { data } = await localAxios.get<TopGenresPerYear[]>(`/topGenresPerYear/${year}`);
			const formattedData = formatTopGenresForBumpChart(data);
			setTopList(formattedData);
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
		<>
			<Container>
				<Jumbotron style={{ padding: '3rem 2rem' }}>
					<h1>Jak zmieniały się najpopularniejsze gatunki?</h1>
					<h6>Wybierz rok, i zobacz jak preferencje słuchaczy zmieniały się na przestrzeni 5 lat od wybranego roku</h6>
				</Jumbotron>

				<Row>
					<Col xs={9}>
						<Slider label='Wybierz rok początkowy' min={1960} max={2016} step={1} value={year} onChange={onChangeYear} />
					</Col>
					<Col xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
						<Button style={{ width: 200, padding: '10px inherit' }} onClick={getTopGenresStartingYear}>
							Pobierz dane!
						</Button>
					</Col>
				</Row>
			</Container>

			<AsyncWrapper isFetching={isFetching}>
				{topGenresList.length > 0 && (
					<div>
						<BumpChart data={topGenresList} />
					</div>
				)}
			</AsyncWrapper>
		</>
	);
};

export default TopGenresPerYearLayout;
