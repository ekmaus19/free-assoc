const defaultState = {login:{isLoggedin:false}}
export const reducer = (state=defaultState, action) => {
    console.log(action)
    switch (action.type) {
        case "LOGIN": 
            return Object.assign({}, state, {login: {isLoggedin:true}} )
        default:
            return state;
    }
 };
 