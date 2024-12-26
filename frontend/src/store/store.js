import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patient';
import doctorReducer from './doctor'; 
import categoryReducer from './categories'; 
import orderReducer from './order'; 
import subcategoryReducer from './subcategories'; 
import authReducer from './auth'; 
import adminLogin from './admin'; 
const store = configureStore({
  reducer: {
    patient: patientReducer, // Keeping the key consistent with the slice name
    doctors: doctorReducer, // Keeping the key consistent with the slice name
    categories: categoryReducer, 
    order: orderReducer, 
    subcategory: subcategoryReducer, 
    auth: authReducer,
    adminLogin: adminLogin,
  },
});

export default store;
