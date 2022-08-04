import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../store/accordionSlice'
import { Typography } from '@mui/material';
export default function NestedList({ groupName, keywords }) {

    const [open, setOpen] = React.useState(true);


    return (
        <Accordion sx={{width:'100%',overflow:'auto'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography  variant="button" sx={{width:'100%', fontWeight:700}}>{groupName}</Typography>
      
        </AccordionSummary>
        <AccordionDetails>
        <List component="div" disablePadding sx={{ paddingLeft: 0,overflowY: 'auto', maxHeight:300,overflow:'auto' }}>
                    {keywords && keywords.map((m, i) => {
                        const { keyword, index, count } = m;
                        return <RenderRow key={i} keyword={keyword} index={index} count={count} />
                    })}
                </List>
        </AccordionDetails>
      </Accordion>
    );
}



function RenderRow(props) {
    const dispatch = useDispatch()
    const { selectedNavIndex } = useSelector(state => state.accordion)
    const { keyword, index, count } = props;
    const matchfound = selectedNavIndex.split('-').find(f => f === index.replace('-', '')) ? true : false
    if (matchfound) {

    }
    function handleClick({ index, keyword }) {
    setTimeout(()=>{
        dispatch(actions.setSelectedNavIndex({ index, keyword }))
    },500)
     
    }
    return (
        <ListItem
            key={index}
            secondaryAction={
                <div>{count}</div>
            }
            disablePadding
        >
            <ListItemButton onClick={() => handleClick({ index, keyword })} dense id={index} name={keyword}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={matchfound}
                        tabIndex={-1}
             
                        inputProps={{ 'aria-labelledby': "" }}
                    />
                </ListItemIcon>
                <ListItemText id="s" primary={keyword} />
            </ListItemButton>
        </ListItem>
    );
}


