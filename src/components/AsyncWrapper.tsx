import React from 'react';
import { Spinner } from 'react-bootstrap';

interface AsyncWrapperProps {
	isFetching: boolean;
}

const wrapperStyles: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginTop: 200,
};

const spinnerStyles: React.CSSProperties = {
	width: '8rem',
	height: '8rem',
	borderWidth: '0.75rem',
};

const AsyncWrapper: React.FC<AsyncWrapperProps> = ({ isFetching, children }) => {
	return isFetching ? (
		<div style={wrapperStyles}>
			<Spinner style={spinnerStyles} animation='border' />
		</div>
	) : (
		<>{children}</>
	);
};

export default AsyncWrapper;
