import React from 'react';
import { Table } from 'react-bootstrap';
import { BillboardTrack } from '../modules/types';

interface Top100TableProps {
	songsList: BillboardTrack[];
}

const Top100Table: React.FC<Top100TableProps> = ({ songsList }) => {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Wykonawca</th>
					<th>Tytuł utworu</th>
					<th>Gatunek</th>
				</tr>
			</thead>
			<tbody>
				{songsList.map((song) => (
					<tr key={song.rank}>
						<td>{song.rank}</td>
						<td>{song.artist}</td>
						<td>{song.title}</td>
						<td>{song.topGenre}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default Top100Table;
