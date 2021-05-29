export interface BillboardTrackApi {
	artist: string;
	title: string;
	cover: string;
	rank: number;
	position: object;
}

export interface BillboardTrack {
	artist: string;
	title: string;
	rank: number;
	topGenre: string;
}

export interface LastfmTag {
	count: number; // liczba między 0 a 100, gdzie 100 to najbardziej pasujący a 0 to najmniej pasujący
	name: string;
	url: string; // url do strony na lastfm poświęconej danemu tagowi
}

export interface TagsData {
	error?: number; // jeśli to pole jest w obiekcie, to znaczy że nie udało się znaleźć tagów dla wybranego utworu
	toptags: {
		tag: LastfmTag[];
	};
}

export interface Genres {
	[key: string]: number;
}

export interface PieChartDataItem {
	id: string;
	label: string;
	value: number;
}

export interface SummedGenre {
	genre: string;
	count: number;
}

export interface TopGenresPerYearFromDb {
	__v: number;
	_id: string;
	year: number;
	genres: Array<{
		_id?: string;
		count: number;
		genre: string;
	}>;
}

export interface TopGenresPerYear {
	year: number;
	genres: SummedGenre[];
}

export interface BumpChartDataItem {
	id: string;
	data: Array<{
		x: number;
		y: number;
	}>;
}
