import { ReactNode, useEffect, useState } from 'react';
import './Auth.css';

interface AuthProps {
    children: ReactNode;
}

export const Auth = ({ children }: AuthProps) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    return (
        <>
            <div className="auth-container">

                <div className="auth-content">
                    {children}
                </div>
                <div className="picture">
                </div>
            </div>
            
        </>
        
    );
};