import React, { useEffect, useState } from 'react';
import { MultiSelect, Option } from 'react-rainbow-components';
import { MultiSelectOption } from 'react-rainbow-components/components/MultiSelect';

const genresForComparison = [
	'pop',
	'hip-hop',
	'rock',
	'country',
	'r&b',
	'jazz',
	'funk',
	'soul',
	'disco',
	'folk',
	'dance',
	'metal',
	'new wave',
	'indie',
	'alternative',
	'electronic',
];

interface MultiGenreSelectProps {
	onChange: (selectedGenres: string[]) => void;
}

const initialValues: MultiSelectOption[] = [
	{ name: 'pop', label: 'pop', value: 'pop' },
	{ name: 'hip-hop', label: 'hip-hop', value: 'hip-hop' },
	{ name: 'rock', label: 'rock', value: 'rock' },
	{ name: 'country', label: 'country', value: 'country' },
];

const MultiGenreSelect: React.FC<MultiGenreSelectProps> = ({ onChange }) => {
	const [selectedGenres, setSelectedGenres] = useState<MultiSelectOption[]>(initialValues);

	const handleSelectChange = (newValue: MultiSelectOption[]) => {
		if (newValue.length === 0) {
			return alert('przynajmniej jeden gatunek musi być zaznaczony');
		}

		if (newValue.length > 10) {
			return alert('możesz wybrać max 10 elementów');
		}

		setSelectedGenres(newValue);
	};

	useEffect(() => {
		onChange(selectedGenres.map(({ name }) => name as string));
	}, [selectedGenres, onChange]);

	return (
		<MultiSelect
			label='Zestaw wybrane gatunki'
			placeholder='Wybierz gatunki'
			className='rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto'
			value={selectedGenres}
			onChange={handleSelectChange}
			bottomHelpText='Możesz wybrać do 10 gatunków'
			variant='chip'
			chipVariant='outline-brand'
			showCheckbox
		>
			{genresForComparison.map((genreName, idx) => (
				<Option key={idx} name={genreName} label={genreName} value={genreName} />
			))}
		</MultiSelect>
	);
};

export default MultiGenreSelect;
