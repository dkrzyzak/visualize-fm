import { ResponsiveBump } from '@nivo/bump';
import React from 'react';
import { BumpChartDataItem } from '../modules/types';

interface BumpChartProps {
	data: BumpChartDataItem[];
}

const BumpChart: React.FC<BumpChartProps> = ({ data }) => {
	const extraProps = {
		lineWidth: 4,
		activeLineWidth: 6,
		inactiveLineWidth: 2,
	};

	return (
		<div style={{ width: 1200, height: 500, marginTop: 50, marginBottom: 200, marginLeft: -30 }}>
			<ResponsiveBump
				data={data}
				margin={{ top: 40, right: 200, bottom: 40, left: 60 }}
				colors={{ scheme: 'dark2' }}
				{...(extraProps as any)}
				inactiveOpacity={0.15}
				pointSize={10}
				activePointSize={16}
				inactivePointSize={0}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={3}
				activePointBorderWidth={3}
				pointBorderColor={{ from: 'serie.color' }}
				theme={{
					fontSize: 20,
					// fontFamily: 'Makhina',
				}}
				axisTop={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: '',
					legendPosition: 'middle',
					legendOffset: -36,
				}}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: '',
					legendPosition: 'middle',
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 6,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'ranking',

					legendPosition: 'middle',
					legendOffset: -40,
				}}
			/>
		</div>
	);
};

export default BumpChart;