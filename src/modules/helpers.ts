import dayjs from 'dayjs';
import axios from 'axios';
import localAxios from '../axios';
import { BillboardTrack, BillboardTrackApi, Genres, PieChartDataItem, TagsData } from './types';

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

interface TopWeekGenre {
	week: string;
	topGenre: string;
}

export const getTopGenresForYear = async (year: number) => {
	const firstDayOfYear = dayjs(`${year}-01-01`);

	let currentWeek = firstDayOfYear;
	const weeks: TopWeekGenre[] = [];

	while (currentWeek.year() === year) {
		const fetchedList = await fetch100(currentWeek.toDate());
		const genres = countGenres(fetchedList);
		delete genres.other;
		console.log(genres);

		const topGenre = Object.entries(genres);

		const tmp1 = topGenre.map(([key, value]) => ({ genre: key, value }));
		const tmp2 = tmp1.sort((a, b) => b.value - a.value);
		const tmp3 = tmp2[0].genre;
		console.log(tmp1, tmp2, tmp3);

		weeks.push({ week: currentWeek.format('DD/MM/YYYY'), topGenre: tmp3 });
		currentWeek = currentWeek.add(1, 'week');
	}

	return weeks;
};

export const formatTopGenresToChartData = () => {};
