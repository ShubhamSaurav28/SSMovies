import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Loading from './components/Loading';
import BlockedPage from './components/BlockedPage'; // New blocked page component
import MoviesPage from './components/MoviesPage';
import MovieDetail from './components/MovieDetail';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import BookingPage from './components/BookingPage';
import HallPage from './components/HallPage';

// Dynamically import components
const Home = React.lazy(() => import('./components/Home'));
const Login = React.lazy(() => import('./components/Login'));
const SignUp = React.lazy(() => import('./components/SignUp'));


// Route to block access if a token exists in sessionStorage
const BlockedRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  return token ? <BlockedPage /> : children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <Router>
            <Header />
            <main>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path='/movies' element={<MoviesPage/>}/>
                  <Route path="/movies/:movieId" element={<MovieDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/book/:movieId" element={<BookingPage />} />
                  <Route path="/hall/:hallId" element={<HallPage />} />
                  <Route
                    path="/login"
                    element={
                      <BlockedRoute>
                        <Login />
                      </BlockedRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <BlockedRoute>
                        <SignUp />
                      </BlockedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
          </Router>
        )}
      </div>
  );
}

export default App;
