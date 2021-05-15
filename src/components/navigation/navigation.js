import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import './navigation.css'

export const NavigationPanel = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar className="navPanel" dark expand="md">
                <NavbarBrand className="navLogo">BasementBot</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink className="navLink" activeClassName="activeNavLink" tag={RRNavLink} to="/status">Status</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="navLink" activeClassName="activeNavLink" tag={RRNavLink} to="/plugins">Plugins</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="navLink" activeClassName="activeNavLink" tag={RRNavLink} to="/guilds">Guilds</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}