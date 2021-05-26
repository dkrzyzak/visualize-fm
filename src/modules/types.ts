export interface BillboardTrack {
	artist: string;
	title: string;
	cover: string;
	rank: number;
	position: object;
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
