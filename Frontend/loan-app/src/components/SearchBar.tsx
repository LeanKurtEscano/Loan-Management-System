import React, { useEffect, useState } from 'react'
import { searching } from '../services/admin/adminData';
interface SearchProps {
    endpoint: string;
}
const SearchBar:React.FC<SearchProps> = ({endpoint}) => {


    const [searchData, setSearchData] = useState([])
    const [search, setSearch ] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value } = e.target;

       setSearch(value);

    };


    useEffect(()=> {
        const fetchSearchData = async() => {
            const response = await searching(search,endpoint);

            setSearch(response?.data)
        }

        fetchSearchData()

    },[search])

  return (
    <div>SearchBar</div>
  )
}

export default SearchBar