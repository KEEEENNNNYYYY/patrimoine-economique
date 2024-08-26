import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Navbar = () => {
    return (
        <nav>
            <button className="nav-button">
                <Link to="/patrimoine">Patrimoine</Link>
            </button>
            <button className="nav-button">
                <Link to="/ListPossession">Liste de Possession</Link>
            </button>
        </nav>
    );
};

export default Navbar;
