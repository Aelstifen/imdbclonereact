import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <nav className="admin-sidebar-nav">
                <NavLink to="/admin/titles">Titles</NavLink>
                <NavLink to="/admin/actors">Actors</NavLink>
                <NavLink to="/admin/users">Users</NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;