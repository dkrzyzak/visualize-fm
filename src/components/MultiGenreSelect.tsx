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

const MultiGenreSelect: React.FC<MultiGenreSelectProps> = ({ onChange }) => {
	const [value, setValue] = useState<MultiSelectOption[]>([]);

	const handleSelectChange = (value: MultiSelectOption[]) => {
		console.log(value);
		const selectedGenres = value.map(({ name }) => name as string);
		onChange(selectedGenres);

		if (value.length > 10) {
			return alert('możesz wybrać max 10 elementów');
		}

		setValue(value);
	};

	return (
		<MultiSelect
			label='MultiSelect Label'
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
