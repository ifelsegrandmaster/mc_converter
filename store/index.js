import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import appReducer from "../appSlice";
import calculatorReducer from "../components/calculator/calculatorSlice";


export default configureStore({
    reducer: {
        app: appReducer,
        calculator: calculatorReducer,
    },
    middleware: [thunkMiddleware, ...getDefaultMiddleware()]
})