import { createSlice } from '@reduxjs/toolkit'

interface AuthStateState {
   isLoggedIn: boolean
}

const initialState: AuthStateState = { 
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', JSON.stringify(state.isLoggedIn))
        },
        logout: (state) => {
            state.isLoggedIn = false
            localStorage.removeItem('isLoggedIn')
        }
    },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

export const selectIsLoggedIn = (state: { auth: AuthStateState }) => state.auth.isLoggedIn;