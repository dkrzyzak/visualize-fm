import React, { useState } from 'react';
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
	const [value, setValue] = useState<MultiSelectOption[]>(initialValues);

	const handleSelectChange = (value: MultiSelectOption[]) => {
		console.log(value);
		const selectedGenres = value.map(({ name }) => name as string);
		onChange(selectedGenres);

		if (value.length === 0) {
			return alert('przynajmniej jeden gatunek musi być zaznaczony');
		}

		if (value.length > 10) {
			return alert('możesz wybrać max 10 elementów');
		}

		setValue(value);
	};

	return (
		<MultiSelect
			label='Zestaw wybrane gatunki'
			placeholder='Wybierz gatunki'
			className='rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto'
			value={value}
			onChange={handleSelectChange}
			bottomHelpText='Możesz wybrać do 10 gatunków'
			variant='chip'
			showCheckbox
		>
			{genresForComparison.map((genreName, idx) => (
				<Option key={idx} name={genreName} label={genreName} value={genreName} />
			))}
		</MultiSelect>
	);
};

export default MultiGenreSelect;
