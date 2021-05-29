import dayjs from 'dayjs';
import axios from 'axios';
import localAxios from '../axios';
import { BillboardTrack, BillboardTrackApi, BumpChartDataItem, Genres, PieChartDataItem, TagsData, TopGenresPerYear } from './types';

const lastfmAPIKey = process.env.REACT_APP_LASTFM_API_KEY;

export const getTagsForSongUrl = (artist: string, trackName: string) => {
	const formattedArtist = artist.split(' Featuring')[0].split(' &')[0];
	const artistUri = encodeURI(formattedArtist);
	const trackUri = encodeURI(trackName);

	return `http://ws.audioscrobbler.com/2.0/?method=track.getTopTags&api_key=${lastfmAPIKey}&artist=${artistUri}&track=${trackUri}&format=json`;
};

export const validateTag = (tagName: string) => {
	// ujednolicenie hip-hop oraz hip hop, traktowanie rapu jako hip-hop (nie dzwońcie na policję)
	if (tagName === 'hip hop' || tagName === 'hiphop' || tagName.includes('rap')) {
		return 'hip-hop';
	}

	if (tagName.includes('indie')) {
		return 'indie';
	}

	if (tagName.includes('rock')) {
		return 'rock';
	}

	if (tagName.includes('metal')) {
		return 'metal';
	}

	// for neo-soul
	if (tagName.includes('soul')) {
		return 'soul';
	}

	// ujednolicenie r&b oraz rnb
	if (tagName === 'rnb') {
		return 'r&b';
	}

	// z reguły jeśli tag składa się z więcej niż 3 pełnych wyrazów, to jest to jakieś zdanie albo fraza, a nie gatunek muzyczny
	if (tagName.split(' ').length > 3) {
		return 'other';
	}

	// wywalamy liczby
	if (!isNaN(parseInt(tagName))) {
		return 'other';
	}

	return tagName;
};

export const fetch100 = async (startDate: Date): Promise<BillboardTrack[]> => {
	// zapytanie do lokalnego api po listę hot100 dla danego tygodnia
	const formattedDate = dayjs(startDate).format('YYYY-MM-DD');
	const { data: billboardList } = await localAxios.get<BillboardTrackApi[]>(`/billboard100?date=${formattedDate}`);

	const dataWithTags = await Promise.all(
		billboardList.map(async ({ artist, title, rank }) => {
			// nie potrzebujemy wszystkich pól które dostarcza nam api, potrzebujemy tylko artist, title oraz rank
			// więc mapujemy ten duży obiekt na nieco mniejszy, zawierający tylko te dane które potrzebujemy (+ pobieramy informację co do gatunku)
			const formattedSong: BillboardTrack = {
				artist,
				title,
				rank,
				topGenre: '',
			};

			const url = getTagsForSongUrl(artist, title);
			try {
				// pobieranie danych o tagach danej piosenki z api last.fm
				const { data: tags } = await axios.get<TagsData>(url);

				// jeśli dostaniemy błąd z serwera lub lista tagów będzie pusta, to ustawiamy gatunek na other
				if (tags.hasOwnProperty('error') || !tags.toptags?.tag?.length) {
					formattedSong.topGenre = 'other';
					return formattedSong;
				}

				// przepuszczamy otrzymany najpopularniejszy tag przez walidator
				const validatedTag = validateTag(tags.toptags.tag[0].name.toLowerCase());
				formattedSong.topGenre = validatedTag;
				return formattedSong;
			} catch (e) {
				// jeśli wystąpi błąd zapytania to ustawiamy gatunek piosenki na other
				formattedSong.topGenre = 'other';
				return formattedSong;
			}
		})
	);

	return dataWithTags;
};

//  dostajemy obiekt postaci { pop: 12, rock: 16. ... }
export const countGenres = (billboardList: BillboardTrack[]): Genres => {
	const genres: Genres = {};
	billboardList.forEach((song) => {
		if (genres.hasOwnProperty(song.topGenre)) {
			genres[song.topGenre] += 1;
		} else {
			genres[song.topGenre] = 1;
		}
	});

	return genres;
};

// legitimacyThreshold === ile razy tag musi zostać powtórzonym żeby zostać potraktowanym jako prawdziwy gatunek
// domyślnie 0, czyli każdy tag jest traktowany jako gatunek
export const formatGenresToChartData = (genres: Genres, countOther = false, legitimacyThreshold = 0): PieChartDataItem[] => {
	let extraOthers = 0;

	const data: PieChartDataItem[] = Object.entries(genres)
		.map(([key, value]) => ({
			id: key,
			label: key,
			value: value,
		}))
		.filter(({ value }) => {
			if (value < legitimacyThreshold) {
				extraOthers++;
				return false;
			}

			return true;
		});

	// wykonujemy tą dodatkową operację tylko jeśli faktycznie wyrzuciliśmy jakieś tagi z listy, ponieważ się nie kwalifikowały ze względu na ilość wystąpień
	if (extraOthers > 0) {
		const otherIdx = data.findIndex((el) => el.id === 'other');
		data[otherIdx].value += extraOthers;
	}

	data.sort((a, b) => b.value - a.value);

	return countOther ? data : data.filter((el) => el.id !== 'other');
};

interface GenreCounted {
	genre: string;
	count: number;
}

export const getTopGenresForYear = async (year: number) => {
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

// (async () => {
// 	for (let i = 1996; i < 2021; i++) {
// 		await getThatData(i);
// 	}
// })();

export const formatTopGenresForChart = (topList: TopGenresPerYear[]): BumpChartDataItem[] => {
	const setOfGenres = new Set<string>();
	topList.forEach((year) => {
		year.genres.length = 5;
		year.genres.forEach((genreSummary) => setOfGenres.add(genreSummary.genre));
	});

	topList.forEach((year) => {
		setOfGenres.forEach((genreName) => {
			if (year.genres.findIndex((el) => el.genre === genreName) === -1) {
				year.genres.push({ genre: genreName, count: 0 });
			}
		});
	});

	const result = Array.from(setOfGenres).map((genreName) => {
		const data = topList.map((yearSummary) => {
			return {
				x: yearSummary.year,
				y: yearSummary.genres.findIndex((genre) => genre.genre === genreName) + 1,
			};
		});

		return {
			id: genreName,
			data: data,
		};
	});

	console.log(setOfGenres);
	console.log(topList);

	return result;
};
