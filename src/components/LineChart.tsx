import React from 'react';
import { Point, ResponsiveLine, Serie } from '@nivo/line';

interface LineChartProps {
	data: Serie[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
	return (
		<div style={{ width: 1200, height: 500, marginTop: 50, marginBottom: 200, marginLeft: -30 }}>
			<ResponsiveLine
				data={data}
				colors={(d: Point) => colorsForGenres[d.id]}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				yScale={{ type: 'linear', min: 1, max: 16, stacked: false, reverse: true }}
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
				lineWidth={4}
				useMesh={true}
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
				theme={{
					fontSize: 16,
					tooltip: {
						container: {
							background: '#222',
						},
					},
				}}
				tooltip={({ point }) => (
					<div style={{ color: point.serieColor, backgroundColor: '#222', padding: '5px 10px', textAlign: 'center' }}>
						<h5 style={{ fontVariant: 'simplified', textShadow: '1px 1px 1px #ccc' }}>{point.serieId}</h5>
						{point.data.y === 16 ? (
							<strong>brak</strong>
						) : (
							<span>
								#<strong>{point.data.y}</strong>
							</span>
						)}{' '}
						w roku <strong>{point.data.xFormatted}</strong>
					</div>
				)}
			/>
		</div>
	);
};

const colorsForGenres: any = {
	pop: '#ffd92f',
	'hip-hop': '#2ca02c',
	rock: '#d62728 ',
	country: '#ff7f0e',
	'r&b': '#9467bd',
	jazz: '#8c564b',
	funk: '#21913b',
	soul: '#a6d854',
	disco: '#e377c2',
	folk: '#7f7f7f',
	dance: '#e4ba32',
	metal: '#fc4e2a',
	'new wave': '#bcbd22',
	indie: '#1f77b4',
	alternative: '#f0027f',
	electronic: '#17becf',
};

export default LineChart;
