import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logoImg from '../assets/lastfm-512.png';

const TopBar: React.FC = () => {
	return (
		<Navbar bg='dark' variant='dark'>
			<Navbar.Brand href='#home'>
				<img alt='' src={logoImg} width='30' height='30' className='d-inline-block align-top' /> Visualize.fm
			</Navbar.Brand>
			<Nav className='mr-auto'>
				<LinkContainer to='/'>
					<Nav.Link>Home</Nav.Link>
				</LinkContainer>
				<Nav.Link href='#link'>Link</Nav.Link>
			</Nav>
		</Navbar>
	);
};

export default TopBar;
