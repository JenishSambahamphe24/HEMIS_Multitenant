// HomeRedirect.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
    const { currentUser } = useSelector(state => state.user);

    if (!currentUser) {
        return <Navigate to='/open-enroll' />;
    }
    
    return <Navigate to='/' />;
};

export default HomeRedirect;
