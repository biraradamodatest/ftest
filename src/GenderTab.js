import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchBox from './SearchBox';
import Container from '@mui/material/Container';
import CategoryTab from './CategoryTabs'
import FilterResult from './FilterResult';

export default function CenteredTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container >
    
            <Tabs centered value={value} onChange={handleChange}    allowScrollButtonsMobile >
                <Tab label="KADIN" />
                <Tab label="ERKEK" />
                <Tab label="KIZ ÇOCUK" />
                <Tab label="ERKEK ÇOCUK" />
                <Tab label="KIZ BEBEK" />
                <Tab label="ERKEK BEBEK" />
               
            </Tabs>
            <CategoryTab/>
            <SearchBox />
            <FilterResult/>
        </Container>


    );
}