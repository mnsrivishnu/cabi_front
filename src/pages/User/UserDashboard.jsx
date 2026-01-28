import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { rideService } from '../../services/rideService';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      console.log('Loading user data with token:', token.substring(0, 20) + '...');

      // 1️⃣ Load user profile FIRST (auth-critical)
      const userProfile = await authService.getUserProfile();
      setUser(userProfile);

      // 2️⃣ Load current ride (business logic, NOT auth-critical)
      try {
        const ride = await rideService.getCurrentRide();
        setCurrentRide(ride);
      } catch (rideErr) {
        const status = rideErr.response?.status;
        console.log('Ride fetch error:', status);

        // No active ride → perfectly valid
        if (status === 404 || status === 401) {
          setCurrentRide(null);
        } else {
          throw rideErr; // unexpected error
        }
      }

    } catch (err) {
      console.error('Error loading user data:', err);

      // ONLY logout if profile/auth itself failed
      if (err.response?.status === 401) {
        console.warn('Authentication failed, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }

      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="message message-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </header>

      <div className="page-content">
        {currentRide ? (
          <div className="card">
            <h2 className="heading-lg">
              {currentRide.status === 'COMPLETED' ? 'Ride Completed - Payment Required' : 
               currentRide.status === 'REQUESTED' ? 'Ride Requested - Waiting for Driver' :
               currentRide.status === 'ACCEPTED' ? 'Driver Assigned - En Route' :
               currentRide.status === 'IN_PROGRESS' ? 'Ride in Progress' : 'Current Ride'}
            </h2>

            <div className="ride-card">
              <p><strong>Status:</strong> <span className={`status-badge status-${currentRide.status.toLowerCase()}`}>{currentRide.status}</span></p>
              <p><strong>From:</strong> {currentRide.pickupLocation}</p>
              <p><strong>To:</strong> {currentRide.dropoffLocation}</p>
              <p><strong>Fare:</strong> ₹{currentRide.fare}</p>

              {currentRide.driver && (
                <div className="mt-md">
                  <p><strong>Driver:</strong> {currentRide.driver.name}</p>
                  <p><strong>Phone:</strong> {currentRide.driver.phone}</p>
                  <p><strong>Vehicle:</strong> {currentRide.driver.vehicleDetails}</p>
                </div>
              )}

              <button 
                onClick={() => navigate('/user/current-ride')} 
                className="btn btn-primary btn-full mt-md"
              >
                {currentRide.status === 'COMPLETED'
                  ? `💳 Pay Now - ₹${currentRide.fare}`
                  : currentRide.status === 'REQUESTED'
                    ? '👁️ Track Status'
                    : '🚗 View Current Ride'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="heading-lg">No Active Ride</h2>
            <p className="text-secondary mb-lg">Ready to book your next ride?</p>
            <button 
              onClick={() => navigate('/user/book')} 
              className="btn btn-primary btn-lg"
            >
              Book a Ride
            </button>
          </div>
        )}

        <div className="card">
          <h3 className="heading-md">Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <button onClick={() => navigate('/user/book')} className="btn btn-secondary btn-lg">
              📍 Book New Ride
            </button>
            <button onClick={() => navigate('/user/history')} className="btn btn-secondary btn-lg">
              📋 Ride History
            </button>
            <button onClick={() => navigate('/user/profile')} className="btn btn-secondary btn-lg">
              👤 My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
