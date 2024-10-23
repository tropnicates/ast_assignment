import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul> 
                <li>
                    <Link to="/">Create Rule</Link>
                </li>
                <li>
                    <Link to="/rule-editor">Edit Rules</Link>
                </li>
                <li>
                    <Link to="/rule-evaluator">Evaluate Eligibility</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar