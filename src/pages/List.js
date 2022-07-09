import React, { useEffect } from 'react'
import StatusLists from "../components/StatusLists";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "#4e4e4e",
  
  color: 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
 
  "& .MuiSvgIcon-root":{
   color:"white",
  }
}));

const List = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const dispatch = useDispatch()
  useEffect(()=>{
    document.title = "Haruhi - Lists"
    dispatch(setLoading(false));

  }, [])
  return (
    <div className='w-11/12 mx-auto'>
    <StyledAccordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className='text-xl'>
            Currently Watching
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <StatusLists status={"CURRENT"}/>
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <div className='text-xl'>
            On Hold
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <StatusLists status={"PAUSED"}/>
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <div className='text-xl'>
            Planning
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <StatusLists status={"PLANNING"}/>
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <div className='text-xl'>
            Completed
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <StatusLists status={"COMPLETED"}/>
        </AccordionDetails>
      </StyledAccordion>
      <StyledAccordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
          <div className='text-xl'>
            Dropped
          </div>
        </AccordionSummary>
        <AccordionDetails>
        <StatusLists status={"DROPPED"}/>
        </AccordionDetails>
      </StyledAccordion>
    </div>

  )
}

export default List