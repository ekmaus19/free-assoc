
// const defaultState = {login:{isLoggedin:false}}
// export default (state=defaultState, action) => {
//     console.log(action)
//     switch (action.type) {
//         case "LOGIN": 
//             return Object.assign({}, state, {login: {isLoggedin:action.payload}} )
//         default:
//             return state;
//     }
//  };

 
// export default (state={}, action) =>{
//     console.log(action)
//     switch (action.type){
//         case "ARTISTINFO":
//             return Object.assign({}, state, {artist:action.payload})
//         default: 
//             return state; 
//     }
// }