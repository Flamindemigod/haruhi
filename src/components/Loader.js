import React from 'react'
import HashLoader from "react-spinners/HashLoader";
import { useSelector } from "react-redux"

const Loader = () => {
  const loading = useSelector((state)=>state.loading.value)
  return (
    loading ? (<div className='fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-primary-200 to-secondary-400' style={{zIndex:"10000"}}><HashLoader
    color='#286393'
    cssOverride={{}}
    loading={true}
    size={100}
  /></div>):(<></>)
  )
}

export default Loader