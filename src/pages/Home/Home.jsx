// src/pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    const role = authService.getRole();
    setIsAuthenticated(authenticated);
    setUserRole(role);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userRole === 'USER') {
        navigate('/user/dashboard');
      } else if (userRole === 'DRIVER') {
        navigate('/driver/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>🚕 CabiGo</h1>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="text-secondary">Welcome back!</span>
              <button onClick={handleGetStarted} className="btn btn-primary">
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-secondary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="page-content">
        <div className="card">
          <div className="text-center">
            <h1 className="heading-xl">
              Your Ride, <span className="text-accent">CabiGo Style</span>
            </h1>
            <p
              className="text-secondary mb-lg"
              style={{ fontSize: '1.1rem', lineHeight: '1.6' }}
            >
              A full-stack cab booking app with real authentication, role-based dashboards,
              Google Maps integration, distance-based fare calculation, and complete ride history.
              Users book rides, drivers accept them, and everything is tracked cleanly — no fake payments,
              just solid functionality.
            </p>
            <div className="flex gap-md justify-center">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register?role=driver')}
                  className="btn btn-secondary btn-lg"
                >
                  Join as Driver
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-lg text-center">What We Actually Built</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🔐</div>
              <h3 className="heading-sm">Auth + Profile Management</h3>
              <p className="text-secondary">
                Secure login, registration, profile view, and role-based dashboards
                for both Users and Drivers.
              </p>
            </div>

            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📍</div>
              <h3 className="heading-sm">Pickup & Drop via Google Maps</h3>
              <p className="text-secondary">
                Users select pickup and drop locations on Google Maps,
                ensuring accurate routes and distance calculation.
              </p>
            </div>

            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>💰</div>
              <h3 className="heading-sm">Distance-Based Fare Calculation</h3>
              <p className="text-secondary">
                Ride fare is automatically calculated based on distance
                returned from Google Maps.
              </p>
            </div>

            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🚗</div>
              <h3 className="heading-sm">Driver Ride Management</h3>
              <p className="text-secondary">
                Drivers can go online, accept rides, navigate using Maps,
                and track their total earnings.
              </p>
            </div>

            <div className="text-center">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📜</div>
              <h3 className="heading-sm">Ride History</h3>
              <p className="text-secondary">
                Both users and drivers can view past rides with status,
                locations, and fare details.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-lg text-center">How To Use This Thing</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-xl)',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--accent-primary)',
                  color: 'var(--text-dark)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                1
              </div>
              <h3 className="heading-sm">Login & Setup</h3>
              <p className="text-secondary">
                Create an account, log in, and manage your profile from the dashboard.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--accent-primary)',
                  color: 'var(--text-dark)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                2
              </div>
              <h3 className="heading-sm">Book or Accept a Ride</h3>
              <p className="text-secondary">
                Users set pickup & drop locations and view fare.
                Drivers accept rides from their dashboard.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--accent-primary)',
                  color: 'var(--text-dark)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                3
              </div>
              <h3 className="heading-sm">Navigate & Track</h3>
              <p className="text-secondary">
                Drivers navigate using Google Maps and track completed rides
                and total earnings.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="card">
        <div className="text-center">
          <h3 className="text-accent mb-md">🚕 CabiGo</h3>
          <p className="text-secondary mb-lg">
            A real cab booking system built with React and Google Maps.
          </p>
          <p className="text-muted">
            &copy; 2025 CabiGo.
          </p>
        </div>
      </footer>
    </div>
  );
}
