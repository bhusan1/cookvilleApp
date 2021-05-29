import {USER_ADD_CART, USER_CHECKOUT, USER_CLEAR_CART} from "../actions";

const INITIAL_STATE = {
    cart:{
        totalPrice: 0,
        totalCount: 0,
        items:[],
    },
    readyTime: null,
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case USER_ADD_CART:{
            return {
                ...state,
                cart: action.payload,
            }
        }
        case USER_CLEAR_CART: {
            return {
                ...state,
                cart:{
                    totalPrice: 0,
                    totalCount: 0,
                    items:[],
                },
            }
        }
        case USER_CHECKOUT: {
            return {
                ...state,
                readyTime: new Date().setMinutes(new Date().getMinutes() + 6),
            }
        }
        default:{
            return  state;
        }
    }
}
