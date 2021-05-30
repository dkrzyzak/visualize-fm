import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';

interface LineChartProps {
	data: Serie[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
	return (
		<div style={{ width: 1200, height: 500, marginTop: 50, marginBottom: 200, marginLeft: -30 }}>
			<ResponsiveLine
				data={data}
				colors={{ scheme: 'category10' }}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				yScale={{ type: 'linear', min: 1, max: 15, stacked: false, reverse: true }}
				yFormat=' >-.2f'
				xScale={{
					type: 'time',
					format: '%Y',
					useUTC: false,
				}}
				xFormat='time:%Y'
				axisTop={null}
				axisRight={null}
				axisBottom={{
					format: '%Y',
					tickValues: 'every 5 years',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'rok',
					legendOffset: 36,
					legendPosition: 'middle',
				}}
				// axisLeft={{
				// 	orient: 'left',
				// 	tickSize: 5,
				// 	tickPadding: 5,
				// 	tickRotation: 0,
				// 	legend: 'count',
				// 	legendOffset: -40,
				// 	legendPosition: 'middle',
				// }}
				pointSize={0}
				isInteractive={true}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={5}
				pointBorderColor={{ from: 'serieColor' }}
				pointLabelYOffset={-12}
				useMesh={true}
				theme={{
					fontSize: 16,
					// fontFamily: 'Makhina',
				}}
				legends={[
					{
						anchor: 'bottom-right',
						direction: 'column',
						justify: false,
						translateX: 100,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(0, 0, 0, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1,
								},
							},
						],
					},
				]}
			/>
		</div>
	);
};

export default LineChart;
