import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  accordionOneValue: '',
  accordionOneIsExpanded: true,
  accordionMarkaValue: '',
  accordionMarkaIsExpanded: true,
  selectedMarka: '',
  accordionSubcategoryIsExpanded: true,
  totalSubcategory: 0,
  selectedSubcategory: '',
  accordionKeywordsIsExpanded: true,
  selectedKeyword: '',
  keywords: {},
  totalKeyword: 0,
  accordionProductIsExpanded: true,

  //products
  products: [],
  startAt: 0,
  fetching: false,
  scrollHandled: false

}

export const accordionSlice = createSlice({
  name: 'accordion',
  initialState,
  reducers: {
    setAccordionOne: (state, action) => {
      state.accordionOneValue = action.payload
      state.accordionOneIsExpanded = false
    },

    setAccordionMarka: (state, action) => {
      state.accordionMarkaValue = action.payload
      state.accordionmarkaIsExpanded = false

    },
    toggleAccordionOne: (state, action) => {
      state.accordionOneIsExpanded = !state.accordionOneIsExpanded
    },
    toggleAccordionMarka: (state, action) => {
      state.accordionMarkaIsExpanded = !state.accordionMarkaIsExpanded
    },
    setMarka: (state, action) => {
      state.selectedMarka = action.payload
      state.accordionMarkaIsExpanded = false

      state.products=[]

      state.totalSubcategory=0
      state.selectedSubcategory=''
      state.accordionSubcategoryIsExpanded=true

      state.keywords={}
      state.totalKeyword=''
      state.selectedKeyword=''
      state.accordionKeywordsIsExpanded=true

      state.startAt= 0
      state.fetching= false
      state.scrollHandled= false


    },
    toggleAccordionSubcategory: (state, action) => {
      state.accordionSubcategoryIsExpanded = !state.accordionSubcategoryIsExpanded
    },

    setSubcategory: (state, action) => {
      state.selectedSubcategory = action.payload.subcategory
      state.totalSubcategory = action.payload.totalSubcategory
      state.accordionSubcategoryIsExpanded = false

      state.products=[]
      state.keywords={}
      state.totalKeyword=''
      state.selectedKeyword=''
      state.accordionKeywordsIsExpanded=true

      state.startAt= 0
      state.fetching= false
      state.scrollHandled= false

    },
    setSelectedKeyword: (state, action) => {
      state.products=[]
   
      state.startAt= 0
      state.fetching= false
      state.scrollHandled= false

      state.selectedKeyword = action.payload.keyword
      state.totalKeyword = action.payload.total
      state.accordionKeywordsIsExpanded = false

   
      debugger
    },
    toggleAccordionKeywords: (state, action) => {
      state.accordionKeywordsIsExpanded = !state.accordionKeywordsIsExpanded
    },

    setKeywords: (state, action) => {
      state.keywords = action.payload
    },

    //products

    productsFetched: (state, action) => {
      state.products = [...state.products, ...action.payload.products]
      state.startAt = state.startAt + 100

      state.scrollHandled = false

      state.fetching = false
    },
    emptyProducts: (state, action) => {
      state.products = []
    },
    setFetchState: (state, action) => {
      state.fetching = action.payload
    },
    setScrollHandled: (state, action) => {
      state.scrollHandled = action.payload
    }

  },
})

// Action creators are generated for each case reducer function
export const actions = accordionSlice.actions

export default accordionSlice.reducer