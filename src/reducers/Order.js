import { CREATE_ORDER } from "../constants/ActionTypes"

const InitialState = {
order: []
}

export default  (state= InitialState, action) => {
    const {type, payload} = action
switch(type){
    case CREATE_ORDER:
        return{
            ...state, order: [...state.cartItems, payload] 
        }
}
}