import dayjs from 'dayjs';
import localAxios from '../axios';
import { countGenres, fetch100 } from './helpers';
import { Genres } from './types';

export interface GenreCounted {
	genre: string;
	count: number;
}

const getTopGenresForYear = async (year: number) => {
	const firstDayOfYear = dayjs(`${year}-01-01`);

	let currentWeek = firstDayOfYear;
	const genresSummedUp: Genres = {};

	while (currentWeek.year() === year) {
		const fetchedList = await fetch100(currentWeek.toDate());
		const genres = countGenres(fetchedList);
		delete genres.other;

		console.log(genres);

		Object.entries(genres).forEach(([genreName, genreCount]) => {
			if (genresSummedUp.hasOwnProperty(genreName)) {
				genresSummedUp[genreName] += genreCount;
			} else {
				genresSummedUp[genreName] = genreCount;
			}
		});

		currentWeek = currentWeek.add(1, 'week');
	}

	const topGenres: GenreCounted[] = Object.entries(genresSummedUp).map(([genreName, genreValue]) => ({
		genre: genreName,
		count: genreValue,
	}));

	topGenres.sort((a, b) => b.count - a.count);
	console.log(topGenres);

	return topGenres;
};

const getThatData = async (year: number) => {
	const x = await getTopGenresForYear(year);
	console.log(x);
	const y = await localAxios.post(`/topGenresPerYear/${year}`, x);

	console.log(y.status);
};
