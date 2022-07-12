import React, { useEffect, useState } from 'react'
import StatusLists from "../components/StatusLists";
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { Box } from '@mui/material';
import { TabList } from '@mui/lab';
import {useMediaQuery} from '@mui/material';
const List = () => {
  const [tabIndex, setTabIndex] = useState("1");

  const handleChange = (event, newtabIndex) => {
    setTabIndex(newtabIndex);
  };

  const dispatch = useDispatch()
  useEffect(() => {
    document.title = "Haruhi - Lists"
    dispatch(setLoading(false));
    //eslint-disable-next-line
  }, [])
  return (
    <Box sx={{ width: '100%', fontSize: '5rem' }}>
    <TabContext value={tabIndex}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <TabList sx={{"& .MuiTabs-scroller":{marginInline:"auto"}, "& .MuiTabs-flexContainerVertical":{width:"max-content", marginInline:"auto"}}} orientation={ !useMediaQuery('(min-width:600px)') ? 'vertical' : "horizontal"} onChange={handleChange} centered>
        <Tab sx={{"&:not(.Mui-selected)":{color:"#cecece"}}} label="Currently Watching" value="1"/>
        <Tab sx={{"&:not(.Mui-selected)":{color:"#cecece"}}} label="On Hold" value="2"/>
        <Tab sx={{"&:not(.Mui-selected)":{color:"#cecece"}}} label="Planning" value="3"/>
        <Tab sx={{"&:not(.Mui-selected)":{color:"#cecece"}}} label="Completed" value="4"/>
        <Tab sx={{"&:not(.Mui-selected)":{color:"#cecece"}}} label="Dropped" value="5"/>

    </TabList>
    </Box>
    

      <TabPanel value="1" ><StatusLists status={"CURRENT"} /></TabPanel>

      <TabPanel value="2" ><StatusLists status={"PAUSED"} /></TabPanel>
  
      <TabPanel value="3" ><StatusLists status={"PLANNING"} /></TabPanel>
 
      <TabPanel value="4" ><StatusLists status={"COMPLETED"} /></TabPanel>

      <TabPanel value="5" ><StatusLists status={"DROPPED"} /></TabPanel>
      </TabContext>
    
    </Box>
  )
}

export default List