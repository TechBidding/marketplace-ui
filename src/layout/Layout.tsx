import React from 'react'
import { Navbar } from '../components/Navbar'
import './layout.css'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content" style={{ marginLeft: '60px', height: '100vh' }}>
                {children}
            </main>
        </div>
    )
}

export default Layout