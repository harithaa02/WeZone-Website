// // import { Route, Routes } from "react-router-dom";
// // import Dashboard from "./pages/Dashboard";
// // import Birthdays from "./pages/BirthDay";
// // import Sidebar from "./components/Sidebar";
// // import Sports from "./pages/sports";
// // import Polls from "./pages/Polls";
// // import Article from "./pages/Article";
// // import Admin from "./pages/Admin";
// // import { useState } from "react";
// // import SignIn from "./pages/sign";
// // import Session from "./pages/sessions";
// // import Shootout from "./pages/Shootout";
// // import Addsessions from "./pages/Add/Addsession";
// // import Addarticle from "./pages/Add/AddArticle";
// // import Addadmin from "./pages/Add/Addadmin";
// // import { MemoryRouter, useNavigate } from "react-router";

// // const App = () => {
// //   const [authenticated, setAuthenticated] = useState(false);
// //   const Navigate=useNavigate();

// //   const handleLogin = () => {
// //     setAuthenticated(true);
// //   };

// //   return (
// //     <div className="app">
// //       {/* Sidebar should only be visible if authenticated */}
// //       {authenticated && <Sidebar />}

// //       <div className="content">
// //         <MemoryRouter initialEntries={['/']}>
// //         <Routes>
// //           {/* Protected Route Example */}
// //           <Route
// //             path="/"
// //             element={authenticated ? <Dashboard /> : <SignIn handleLogin={handleLogin} />}
// //           />
// //           <Route
// //             path="/birthdays"
// //             element={authenticated ? <Birthdays /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/sports"
// //             element={authenticated ? <Sports /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/sessions"
// //             element={authenticated ? <Session /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/polls"
// //             element={authenticated ? <Polls /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/article"
// //             element={authenticated ? <Article /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/shootout"
// //             element={authenticated ? <Shootout /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/admin"
// //             element={authenticated ? <Admin /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/addsession"
// //             element={authenticated ? <Addsessions /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/addarticle"
// //             element={authenticated ? <Addarticle /> : <Navigate to="/" />}
// //           />
// //           <Route
// //             path="/addadmin"
// //             element={authenticated ? <Addadmin /> : <Navigate to="/" />}
// //           />


// //           <Route path="*" element={<Navigate to="/" />} />
// //         </Routes>
// //         </MemoryRouter>
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;

// import { Route, Routes } from "react-router";
// import Dashboard from "./pages/Dashboard";
// import Birthdays from "./pages/BirthDay";
// import Sports from "./pages/sports";

// import Polls from "./pages/Polls";
// import Article from "./pages/Article";
// import Admin from "./pages/Admin";
// import SignIn from "./pages/sign";
// import Session from "./pages/sessions";
// import Shootout from "./pages/Shootout";
// import Addadmin from "./pages/Add/Addadmin";
// import AddArticle from "./pages/Add/AddArticle";
// import Addsessions from "./pages/Add/Addsession";
// import ForgetPassword from "./pages/ForgetPassword";
// import NewDashBoard from "./pages/NewDashBoard";
// import Addshootout from "./pages/Add/Addshootout";
// import Addsports from "./pages/Add/Addsports";

// // const App = () => {
// //   const [authneticated, setAuthenticated] = useState(false);
// //   const handleLogin = () => {
// //     setAuthenticated(true);
// //   }
  

// //   return (

// //     <div className="app">
// //       {authneticated && <Sidebar />}
// //       <div className="content">
// //         <Routes>
// //           <Route path='/' element={authneticated ? <Dashboard /> : <SignIn handleLogin={handleLogin} />} />
// //           <Route path="/birthdays" element={<Birthdays />} />
// //           <Route path="/sports" element={<Sports />} />
// //           <Route path="/sessions" element={<Session />} />
// //           <Route path="/polls" element={<Polls />} />
// //           <Route path="/article" element={<Article />} />
// //           <Route path="/shootout" element={<Shootout />} />
// //           <Route path="/Admin" element={<Admin />} />
// //           <Route path="/Addadmin" element={<Addadmin />} />
// //           <Route path="/addarticle" element={<AddArticle />} />
// //         </Routes>
// //       </div>
// //     </div>

// //   );
// // };
// const App = () => {
// //   // const [authenticated, setAuthenticated] = useState(false);

// //   // useEffect(() => {
// //   //   const storedAuthStatus = localStorage.getItem('authenticated');
// //   //   if (storedAuthStatus === 'true') {
// //   //     setAuthenticated(true);
// //   //   }
// //   // }, []);

// //   // const handleLogin = () => {
// //   //   setAuthenticated(true);
// //   //   localStorage.setItem('authenticated', 'true');
// //   // };


//   return (
//     <div>
//       {/* {authenticated && <Sidebar setAuthenticated={setAuthenticated}/>} */}
//       <div>
//         <Routes>
//           {/* <Route
//             path="/"
//             element={authenticated ? <Dashboard /> : <SignIn handleLogin={handleLogin} />}
//           /> */}

//           <Route path="/" element={<SignIn />} />
//           <Route element={<AppLayout/>} />
//           <Route path="/home" element={<NewDashBoard />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="birthdays" element={<Birthdays />} />
//           <Route path="sports" element={<Sports />} />
//           <Route path="sessions" element={<Session />} />
//           <Route path="polls" element={<Polls />} />
//           <Route path="article" element={<Article />} />
//           <Route path="shootout" element={<Shootout />} />
//           <Route path="Admin" element={<Admin />} />
//           <Route path="Addadmin" element={<Addadmin />} />
//           <Route path="addarticle" element={<AddArticle />} />
//           <Route path="addsession" element={<Addsessions />} />
//           <Route path="addshootout"element={<Addshootout/>}/>
//           <Route path="addsports" element={<Addsports/>}/>
//           </Route>
//           <Route path="/forgot-password" element={<ForgetPassword />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default App;

// import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Birthdays from "./pages/BirthDay";
import Sports from "./pages/sports";
import Polls from "./pages/Polls";
import Article from "./pages/Article";
import Admin from "./pages/Admin";
import SignIn from "./pages/sign";
import Session from "./pages/sessions";
import Shootout from "./pages/Shootout";
import Addadmin from "./pages/Add/Addadmin";
import AddArticle from "./pages/Add/AddArticle";
import Addsessions from "./pages/Add/Addsession";
import ForgetPassword from "./pages/ForgetPassword";
import NewDashBoard from "./pages/NewDashBoard";
import Addshootout from "./pages/Add/Addshootout";
import Addsports from "./pages/Add/Addsports";
import Addpolls from "./pages/Add/Addpolls";
import { Route, Routes } from "react-router";

import Logout from "./Logout";

// import AppLayout from "./Applayout";




const App = () => {
 
  return (
    <>
      <Routes>
        
        <Route path="/" element={<SignIn />} />
        {/* <Route element={<AppLayout/>}/> */}
          <Route path="/home" element={<NewDashBoard />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="birthdays" element={<Birthdays />} />
            <Route path="sports" element={<Sports />} />
            <Route path="sessions" element={<Session />} />
            <Route path="polls" element={<Polls />} />
            <Route path="article" element={<Article />} />
            <Route path="shootout" element={<Shootout />} />
            <Route path="admin" element={<Admin />} />
            <Route path="addadmin" element={<Addadmin />} />
            <Route path="addpolls"element={<Addpolls/>}/>
            <Route path="addarticle" element={<AddArticle />} />
            <Route path="addsession" element={<Addsessions />} />
            <Route path="addshootout" element={<Addshootout />} />
            <Route path="addsports" element={<Addsports />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        <Route path="/forgot-password" element={<ForgetPassword />} />
     
      </Routes>
    
    </>
  );
};

export default App;

