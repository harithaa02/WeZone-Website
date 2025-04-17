// import axios from 'axios';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import token from './token';  // Make sure token is properly imported only once

// function Logout() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userToken = token.getUser();  

//     if (userToken) {
//       axios.put("http://127.0.0.1:8000/login/logout", {}, { 
//         headers: { Authorization: userToken?.response?.auth_token } 
//       })
//         .then((response) => {
//           if (response.status === 200) {
//             localStorage.removeItem('token');  
//             navigate('/');
//             console.log(response?.data);
//           } else {
//             console.error('Logout failed:', response);
//           }
//         })
//         .catch((error) => {
//           console.error('An error occurred during logout:', error);
//         });
//     } else {
//       navigate('/'); 
//     }
//   }, [navigate]);

//   return (
//     <div>
//       <p>Logout</p>
//     </div>
//   );
// }

// export default Logout;




import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import token from './token';  // Make sure token is properly imported only once

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = token.getUser();  

    if (userToken) {
      axios.put("http://127.0.0.1:8000/login/logout", {}, { 
        headers: { Authorization: userToken?.response?.auth_token } 
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.removeItem('token');  
            navigate('/');
            console.log(response?.data);
          } else {
            console.error('Logout failed:', response);
          }
        })
        .catch((error) => {
          console.error('An error occurred during logout:', error);
        });
    } else {
      navigate('/'); 
    }
  }, [navigate]);

  return (
    <div>
      <p>Logout</p>
    </div>
  );
}

export default Logout;