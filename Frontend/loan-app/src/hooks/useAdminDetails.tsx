
import { useQuery } from '@tanstack/react-query'
import { UserDetails } from '../constants/interfaces/authInterface';

import { getAdminDetails } from '../services/admin/adminData';

const useAdminDetails = () => {

    const { data, isLoading, isError, error } = useQuery<UserDetails>(['adminDetails'], getAdminDetails,{
    });

    

    return {
        adminDetails: data,
        isLoading,
        isError,
        error
    }

}

export default useAdminDetails