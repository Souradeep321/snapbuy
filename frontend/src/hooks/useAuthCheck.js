import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, clearAuth } from '../store/userReducer';

export const useAuthCheck = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);

    useEffect(() => {
        // Always check profile on app start to verify if user is logged in
        // This will either authenticate the user or set isLoading to false
        if(!user) return;
        dispatch(getProfile());
    }, [dispatch]);

    const logout = () => {
        dispatch(clearAuth());
        // Clear any stored data
        window.location.href = '/login';
    };

    return { isAuthenticated, user, isLoading, logout };
};


