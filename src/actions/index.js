

// export const loginUser = (username, password) => async dispatch => {
//     try{
//       const res = await fetch('http://localhost:8888/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username,
//           password: password
//         })
//       })
//       if (res.success){
//         dispatch({type:"LOGIN", payload:true})
//       }
//     } catch(e){
//       dispatch({type:'LOGIN', payload:e})
//     }
//   }


