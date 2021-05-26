import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { DatePicker, CheckboxToggle } from 'react-rainbow-components';
import AsyncWrapper from '../components/AsyncWrapper';
import PieChart from '../components/PieChart';
import Hot100Table from '../components/Hot100Table';
import { countGenres, fetch100, formatGenresToChartData } from './helpers';
import { BillboardTrack } from './types';

const Top100Layout: React.FC = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [isFetching, setFetching] = useState(false);
	const [fetchedList, setFetchedList] = useState<BillboardTrack[]>([]);
	const [countOther, setCountOther] = useState(false);

	const onGenerateBtnClick = async () => {
		setFetching(true);
		try {
			const newList = await fetch100(startDate);
			setFetchedList(newList);
		} catch (e) {
			console.log(e);
		} finally {
			setFetching(false);
		}
	};

	const onToggleChange = () => {
		setCountOther((currentValue) => !currentValue);
	};

	useEffect(() => {
		console.log(startDate);
	}, [startDate]);

	return (
		<Container>
			<Jumbotron style={{ padding: '3rem 2rem' }}>
				<h1>Billboard Hot 100</h1>
				<h6>Lista Billboard Hot 100 dla wybranego tygodnia oraz wykres popularności gatunków</h6>
			</Jumbotron>

			<Row>
				<Col xs={5}>
					<DatePicker onChange={(value: Date) => setStartDate(value)} value={startDate} label='Podaj datę' />
				</Col>
				<Col xs={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
					<CheckboxToggle label='Traktuj "other" jako gatunek' value={countOther} onChange={onToggleChange} />
				</Col>

				<Col xs={3}>
					<Button className='mt-4' onClick={onGenerateBtnClick}>
						Pobierz listę!
					</Button>
				</Col>
			</Row>
			<AsyncWrapper isFetching={isFetching}>
				{fetchedList.length > 0 && (
					<div>
						<PieChart data={formatGenresToChartData(countGenres(fetchedList), countOther, 2)} />
						<Hot100Table songsList={fetchedList} />
					</div>
				)}
			</AsyncWrapper>
		</Container>
	);
};

export default Top100Layout;
