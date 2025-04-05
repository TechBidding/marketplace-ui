import { ReactNode} from 'react';
import './auth.css';

interface AuthProps {
    children: ReactNode;
}

export const Auth = ({ children }: AuthProps) => {

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