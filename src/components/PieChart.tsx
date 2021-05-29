import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { PieChartDataItem } from '../modules/types';

interface PieChartProps {
	data: PieChartDataItem[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
	return (
		<div style={{ width: 1080, height: 500, marginTop: 30 }}>
			<ResponsivePie
				data={data}
				margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
				innerRadius={0.5}
				padAngle={0.7}
				cornerRadius={3}
				activeOuterRadiusOffset={8}
				borderWidth={1}
				borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor='#333333'
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: 'color' }}
				arcLabelsSkipAngle={10}
				arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
				defs={[
					{
						id: 'dots',
						type: 'patternDots',
						background: 'inherit',
						color: 'rgba(255, 255, 255, 0.3)',
						size: 4,
						padding: 1,
						stagger: true,
					},
					{
						id: 'lines',
						type: 'patternLines',
						background: 'inherit',
						color: 'rgba(255, 255, 255, 0.3)',
						rotation: -45,
						lineWidth: 6,
						spacing: 10,
					},
				]}
				fill={[
					{
						match: {
							id: 'pop',
						},
						id: 'dots',
					},
					{
						match: {
							id: 'hip-hop',
						},
						id: 'lines',
					},
				]}
				theme={{
					fontSize: 20,
					// fontFamily: 'Makhina',
				}}
			/>
		</div>
	);
};

export default PieChart;
