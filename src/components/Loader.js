import React from 'react'
import HashLoader from "react-spinners/HashLoader";
import { useSelector } from "react-redux"

const Loader = () => {
  const loading = useSelector((state)=>state.loading.value)
  return (
    loading.isLoading ? (<div className='fixed inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-br from-primary-200 to-secondary-400'><HashLoader
    color='#286393'
    cssOverride={{}}
    loading={true}
    size={100}
  /></div>):(<></>)
  )
}

export default Loader