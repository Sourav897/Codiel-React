// import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';

// import { getPosts } from '../api';
import { Home, Login, Settings, Signup, UserProfile } from '../pages';

import { Loader, Navbar } from './';
import { useAuth } from '../hooks';

// const PrivateRoute = ({ children, ...rest }) => {
//   let auth = useAuth();
//   return auth ? children : <Navigate to="/login" />;
// };

// function PrivateRoute({ children, ...rest }) {
//   const auth = useAuth();

//   return (
//     <Routes>
//       <Route
//         {...rest}
//         element={auth.user ? <Settings /> : <Navigate to="/login" />}
//       />
//     </Routes>
//   );
// }

const PrivateRoute = () => {
  let auth = useAuth();
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

const Page404 = () => {
  return <h1>404</h1>;
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route element={<PrivateRoute />}>
            <Route path="/settings" element={<Settings />} exact />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/user/:userId" element={<UserProfile />} exact />
          </Route>

          {/* <Route
            path="/settings"
            element={auth.user ? <Settings /> : <Navigate to="/login" />}
          /> */}

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
