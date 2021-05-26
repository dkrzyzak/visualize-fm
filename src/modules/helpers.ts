import dayjs from 'dayjs';
import axios from 'axios';
import localAxios from '../axios';
import { BillboardTrack, Genres, PieChartDataItem, TagsData } from './types';

const lastfmAPIKey = 'd50ed4606a5fa32f90c6848b546fc8e6';

export const getTagsForSongUrl = (artist: string, trackName: string) => {
	const formattedArtist = artist.split(' Featuring')[0].split(' &')[0];
	const artistUri = encodeURI(formattedArtist);
	const trackUri = encodeURI(trackName);

	return `http://ws.audioscrobbler.com/2.0/?method=track.getTopTags&api_key=${lastfmAPIKey}&artist=${artistUri}&track=${trackUri}&format=json`;
};

// TODO: przepatrzeć różne charty i spróbować uporządkować niektóre rzeczy
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
	const formattedDate = dayjs(startDate).format('YYYY-MM-DD');
	const { data: billboardList } = await localAxios.get<BillboardTrack[]>(`/billboard100?date=${formattedDate}`);

	const dataWithTags = await Promise.all(
		billboardList.map(async (song) => {
			const url = getTagsForSongUrl(song.artist, song.title);
			try {
				const { data: tags } = await axios.get<TagsData>(url);

				// jeśli dostaniemy błąd z serwera lub lista tagów będzie pusta, to ustawiamy gatunek na other
				if (tags.hasOwnProperty('error') || !tags.toptags?.tag?.length) {
					song.topGenre = 'other';
					return song;
				}

				const validatedTag = validateTag(tags.toptags.tag[0].name.toLowerCase());
				song.topGenre = validatedTag;
				return song;
			} catch (e) {
				song.topGenre = 'other';
				return song;
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

// legitimacyThreshold === ile razy przynajmniej tag musi zostać powtórzonym żeby zostać potraktowanym jako prawdziwy gatunek
// domyślnie 0, czyli każdy tag jest traktowany jako gatunek
export const formatGenresToChartData = (
	genres: Genres,
	countOther: boolean = false,
	legitimacyThreshold: number = 0
): PieChartDataItem[] => {
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
	console.log(data);

	return countOther ? data : data.filter((el) => el.id !== 'other');
};
