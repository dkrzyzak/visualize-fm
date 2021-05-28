import { ResponsiveBump } from '@nivo/bump';
import React from 'react';
import { BumpChartDataItem } from '../modules/types';

interface BumpChartProps {
	data: BumpChartDataItem[];
}

const BumpChart: React.FC<BumpChartProps> = ({ data }) => {
	return (
		<div style={{ width: 1000, height: 500 }}>
			<ResponsiveBump
				data={data}
				margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
				colors={{ scheme: 'dark2' }}
				// lineWidth={3}
				// inactiveLineWidth={3}
				// inactiveOpacity={0.15}
				pointSize={10}
				activePointSize={16}
				inactivePointSize={0}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={3}
				activePointBorderWidth={3}
				pointBorderColor={{ from: 'serie.color' }}
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
					tickSize: 5,
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
