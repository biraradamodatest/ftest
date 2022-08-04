
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid'
//import IntersectionObserver from "../intersectObserver";
import ImageComponent from './imageComponent';
import Container from '@mui/material/Container';
import { actions } from '../store/accordionSlice'

import SearchBox from './SearchBox';
import NavigationIcon from '@mui/icons-material/Navigation';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
export default function ProductList(props) {


  const { products, startAt, fetching, selectedMarka, selectedSubcategory, totalKeyword, selectedKeyword, parentKeyword, childkeywords, selectedNavIndex } = useSelector(state => state.accordion)

  const dispatch = useDispatch()



  useEffect(() => {
    var prevScrollpos = window.pageYOffset;
    window.addEventListener('scroll', function scroll() {

      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        //  document.getElementById("navbar").style.top = "0";

        // document.getElementById('static-nav').style.visibility = "visible"

      } else {

        //document.getElementById("navbar").style.top = "-260px";

        // document.getElementById('static-nav').style.visibility = "hidden"
      }
      prevScrollpos = currentScrollPos;

      var myButtom = document.getElementById('nav-top-btn')
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myButtom.style.display = "block";
      } else {
        myButtom.style.display = "none";
      }

      if ((window.innerHeight + window.scrollY) + 2000 >= document.body.offsetHeight) {




        console.log('reached bottom of the page')
        // you're at the bottom of the page
      }




    })
  }, [])


  useEffect(() => {
    // if (state.length > 0) {
    //   let items = document.querySelectorAll(".figure[data-intersection=true]");

    //   const onIntersect = (bool, entry) => {
    //     entry.target.src = entry.target.dataset.src;


    //   };

    //   const intersectObserver = new IntersectionObserver({
    //     items,
    //     callback: onIntersect,
    //     threehold: 0.5,
    //     triggerOnce: false
    //   });
    // }


  }, [])



  function fetchData(start) {
    dispatch(actions.setFetchState(true))

    setTimeout(() => {

      var url = '/api/kadin/data?start=' + start + '&subcategory=' + selectedSubcategory + '&marka=' + selectedMarka + '&selectedNavIndex=' + selectedNavIndex

      
      return fetch(url, { cache: 'default' }).then(function (response) { return response.json() }).then(function (data) {
        return data
      })
        .then(function (data) {
          var collection = data.data

          const fetchAllComplete = [...products, ...collection].length === totalKeyword

          dispatch(actions.productsFetched({ products: collection, fetchAllComplete }))
        })
        .catch(function (err) {
          console.log('err', err)
          return err
        })
    }, 100)

  }

  useEffect(() => {


    fetchData(startAt)

  },

    [])

  useEffect(() => {


    fetchData(startAt)



  }, [selectedNavIndex,selectedSubcategory])








  if(!selectedSubcategory){
    return 
  }

  return (
    <div style={{position:'relative'}}>

{fetching&& <div style={{width:'100%', height:'100vh', backgroundColor:'#fafafa', position:'absolute', top:0,bottom:0, zIndex:10, opacity:0.7, color:'white'}}>  <Box sx={{ display: 'flex', height:'100%', justifyContent:'center',alignItems:'center' }}>
      <CircularProgress color="inherit"/>
    </Box></div>}
  
    <Container sx={{paddingLeft:0, marginTop:2}}>
   
      <Grid container justifyContent="center" spacing={1} margin={0} padding={0}>
        <SearchBox />
  


        {products.length > 0 && products.map((item, i) => {

          return <Grid margin={0} padding={0} item key={i} xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>

            <ImageComponent selectedSubcategory={selectedSubcategory} plcHolder={item.plcHolder} imageUrl={item.imageUrl} title={item.title} marka={item.marka} link={item.link} timestamp={item.timestamp} price={item.priceNew} />

          </Grid>
        })}


      </Grid>


      <Fab id="nav-top-btn" variant="extended" sx={{ position: 'fixed', bottom: 5, right: 5, display: 'none' }} color="primary" onClick={() => { window.scrollTo({ top: 0 }); }}>
        <NavigationIcon />
      </Fab>
    </Container>
    </div>
  );
}


