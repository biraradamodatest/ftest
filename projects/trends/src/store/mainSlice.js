import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  collectedReport: '',
  drawerCollectedOpen: false,
  drawerCollectedBySubcatOpen: true,
  collectedBrend: '',
  selectedMarka: '',

  subcategories: {}
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {

    toggleCollectedDrawer: (state, action) => {

      state.drawerCollectedOpen = !state.drawerCollectedOpen
      state.subcategories={}
      state.selectedMarka=''
      state.collectedBrend=''
    },
    toggleCollectedBySubcatDrawer: (state, action) => {

      state.drawerCollectedBySubcatOpen = !state.drawerCollectedBySubcatOpen
    },
    setCollectedReport: (state, action) => {
      state.drawerCollectedOpen = !state.drawerCollectedOpen
      state.collectedReport = action.payload

    },

    setCollectedBrendReport: (state, action) => {
      state.drawerCollectedBySubcatOpen = !state.drawerCollectedBySubcatOpen
      state.collectedBrend = action.payload
  
    },

    setSelectedMarka: (state, action) => {
      state.selectedMarka = action.payload.marka
      state.drawerCollectedBySubcatOpen = !state.drawerCollectedBySubcatOpen

        state.subcategories = action.payload.subcategories
    },


  },
})

// Action creators are generated for each case reducer function
export const actions = mainSlice.actions

export default mainSlice.reducer