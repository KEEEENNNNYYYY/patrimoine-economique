import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Navbar = () => {
    return (
        <nav>
            <Link className="nav-button" to="/patrimoine">Patrimoine</Link>
            <Link className="nav-button" to="/possession">Possession</Link>
        </nav>
    );
};

export default Navbar;
