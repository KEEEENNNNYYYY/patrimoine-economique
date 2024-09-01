import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Navbar = () => {
    return (
        <nav>
            <Link className="nav-home " to="/">
                <img src="../../public/home (1).png" className='home' alt="image not found" />
            </Link>
            <div className="navContainer">
                <Link className="nav-button" to="/patrimoine">Patrimoine</Link>
                <Link className="nav-button" to="/possession">Possession</Link>
            </div>

        </nav>
    );
};

export default Navbar;
