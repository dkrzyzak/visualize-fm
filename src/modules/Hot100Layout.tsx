import React, { useState } from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { DatePicker, CheckboxToggle } from 'react-rainbow-components';
import dayjs from 'dayjs';
import AsyncWrapper from '../components/AsyncWrapper';
import PieChart from '../components/PieChart';
import Hot100Table from '../components/Hot100Table';
import { countGenres, fetch100, formatGenresToPieChartData } from './helpers';
import { BillboardTrack } from './types';

const minDate = dayjs('1958-08-04').toDate();

const Hot100Layout: React.FC = () => {
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

	return (
		<Container>
			<Jumbotron style={{ padding: '3rem 2rem' }}>
				<h1>Billboard Hot 100</h1>
				<h6>Wykres popularności gatunków w danym tygodniu na podstawie listy wyświetlanej poniżej</h6>
			</Jumbotron>

			<Row>
				<Col xs={5}>
					<DatePicker
						label={<span style={{ textTransform: 'none' }}>Podaj datę</span>}
						value={startDate}
						minDate={minDate}
						maxDate={new Date()}
						onChange={(value: Date) => setStartDate(value)}
					/>
				</Col>
				<Col xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
					<CheckboxToggle label='Traktuj „other” jako gatunek' value={countOther} onChange={onToggleChange} />
				</Col>

				<Col xs={4}>
					<Button style={{ width: 200, padding: '10px inherit' }} className='mt-4' onClick={onGenerateBtnClick}>
						Pobierz listę!
					</Button>
				</Col>
			</Row>
			<AsyncWrapper isFetching={isFetching}>
				{fetchedList.length > 0 && (
					<div>
						<PieChart data={formatGenresToPieChartData(countGenres(fetchedList), countOther, 2)} />
						<Hot100Table songsList={fetchedList} />
					</div>
				)}
			</AsyncWrapper>
		</Container>
	);
};

export default Hot100Layout;
