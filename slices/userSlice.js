import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	email: null,
	password: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setEmail: (state, action) => {
			console.log("action", action);
			state.value = action.payload;
		},
		setPassword: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setEmail, setPassword } = userSlice.actions;

export const selectEmail = (state) => state.user.email;
export const selectPassword = (state) => state.user.password;

export default userSlice.reducer;
