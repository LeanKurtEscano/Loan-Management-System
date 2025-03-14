import { useQuery } from '@tanstack/react-query'
import { UserDetails } from '../constants/interfaces/authInterface';
import { useEffect } from 'react';
import { getUserDetails } from '../services/user/userData';
import { useMyContext } from '../context/MyContext';
const useUserDetails = () => {
    const {isAuthenticated} = useMyContext();
    const { data, isLoading, isError, error } = useQuery<UserDetails>(['userDetails'], getUserDetails,{
        enabled: isAuthenticated, 
    });

    
   
    useEffect(() => {
        if (data) {
          console.log(data);
        }
    }, [data]); 

    return {
        userDetails: data,
        isLoading,
        isError,
        error
    }

}

export default useUserDetails