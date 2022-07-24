import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
import makeQuery from '../misc/makeQuery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Staff = () => {
    const params = useParams();
    const dispatch = useDispatch()
    const [onList,setOnList] = useState(null)
    const [staff, setStaff] = useState({})

    useEffect
  return (
    <div>Staff</div>
  )
}

export default Staff