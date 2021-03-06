import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { Slider } from 'react-rainbow-components';
import { Serie } from '@nivo/line';
import localAxios from '../axios';
import AsyncWrapper from '../components/AsyncWrapper';
import BumpChart from '../components/BumpChart';
import LineChart from '../components/LineChart';
import { cleanDbDataFromUnnecessaryBs, formatTopGenresForBumpChart } from './helpers';
import { TopGenresPerYearFromDb } from './types';
import MultiGenreSelect from '../components/MultiGenreSelect';

const TopGenresPerYearLayout: React.FC = () => {
	const [year, setYear] = useState(1985);
	const [yearRange, setYearRange] = useState(5);
	const [isFetching, setFetching] = useState(false);
	const [isFetchingAllTime, setFetchingAllTime] = useState(false);
	const [topGenresList, setTopList] = useState<Serie[]>([]);
	const [allTimeFullList, setAllTimeFullList] = useState<Serie[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [allTimeFilteredData, setAllTimeFilteredData] = useState<Serie[]>([]);

	const getTopGenresStartingYear = async () => {
		setFetching(true);
		try {
			const { data } = await localAxios.get<TopGenresPerYearFromDb[]>(`/topGenresPerYear/${year}?yearRange=${yearRange}`);
			const cleanedUpData = cleanDbDataFromUnnecessaryBs(data);
			const formattedData = formatTopGenresForBumpChart(cleanedUpData);
			setTopList(formattedData);
		} catch (error) {
			console.log(error);
		} finally {
			setFetching(false);
		}
	};

	const getAllTimeGenresSummary = async () => {
		setFetchingAllTime(true);

		try {
			const { data } = await localAxios.get<Serie[]>(`/topGenresPerYear`);
			setAllTimeFullList(data);
		} catch (e) {
			console.log(e);
		} finally {
			setFetchingAllTime(false);
		}
	};

	const onChangeYear = (event: React.ChangeEvent<HTMLInputElement>) => {
		setYear(+event.target.value);
	};

	const onChangeYearRange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setYearRange(+event.target.value);
	};

	useEffect(() => {
		getTopGenresStartingYear();
		getAllTimeGenresSummary();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (yearRange + year > 2021) {
			setYear((prev) => prev - 1);
		}
	}, [yearRange, year]);

	useEffect(() => {
		const limitedData = allTimeFullList.filter((genre) => selectedGenres.includes(genre.id as string));
		setAllTimeFilteredData(limitedData);
	}, [allTimeFullList, selectedGenres]);

	return (
		<>
			<Container>
				<Jumbotron style={{ padding: '3rem 2rem' }}>
					<h1>Jak zmienia??a si?? popularno???? gatunk??w?</h1>
					<h6>Wybierz rok i zobacz, jak preferencje s??uchaczy zmienia??y si?? w ci??gu {yearRange} lat od wybranego roku</h6>
				</Jumbotron>

				<Row>
					<Col xs={7}>
						<Slider label='Wybierz rok pocz??tkowy' min={1960} max={2021 - yearRange} step={1} value={year} onChange={onChangeYear} />
					</Col>
					<Col xs={2}>
						<Slider label='D??ugo???? przedzia??u' min={4} max={8} step={1} value={yearRange} onChange={onChangeYearRange} />
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

			<Container>
				<Jumbotron style={{ padding: '3rem 2rem' }}>
					<h1>Pe??ny przedzia?? czasowy</h1>
					<MultiGenreSelect onChange={setSelectedGenres} />
				</Jumbotron>
			</Container>

			<AsyncWrapper isFetching={isFetchingAllTime}>
				{allTimeFilteredData.length > 0 && (
					<div>
						<LineChart data={allTimeFilteredData} />
					</div>
				)}
			</AsyncWrapper>
		</>
	);
};

export default TopGenresPerYearLayout;
