import { userHttp } from '@/utility/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface UserDetailType {
    _id: number,
    name: string,
    email: string,
    phoneNumber: string,
    userName: string,
    createdAt: string,
    updatedAt: string,
}
export interface AuthStateState {
    isLoggedIn: boolean,
    userType: string | null,
    userDetails: UserDetailType | null
}

const initialState: AuthStateState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn') || 'false'),
    userType: null,
    userDetails: null
}

const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};


export const fetchUserType = createAsyncThunk("auth/decode-token", async () => {
    const myCookie = getCookie("access_token");

    try {
        const response = await userHttp.post('auth/decode-token', {
            token: myCookie
        })
        return response.data;
    }
    catch (error) {
        console.error("Error fetching user type:", error);
        throw error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', JSON.stringify(state.isLoggedIn))
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userType = null;
            state.userDetails = null;
            localStorage.removeItem('isLoggedIn')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserType.fulfilled, (state, action) => {
            state.userType = action.payload.userType;
            state.userDetails = action.payload.user;
        });
        builder.addCase(fetchUserType.rejected, (state) => {
            localStorage.removeItem('isLoggedIn');
            state.userType = null;
            state.userDetails = null;
            state.isLoggedIn = false;
        });
    },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

export const selectIsLoggedIn = (state: { auth: AuthStateState }) => state.auth.isLoggedIn;