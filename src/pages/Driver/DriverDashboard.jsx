import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { rideService } from '../../services/rideService';

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDriverData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for available rides when driver is online
  useEffect(() => {
    let interval;
    if (isOnline && !currentRide) {
      interval = setInterval(loadAvailableRides, 10000);
    }
    return () => interval && clearInterval(interval);
  }, [isOnline, currentRide]);

  const loadDriverData = async () => {
    try {
      setLoading(true);
      setError('');

      const driverProfile = await authService.getDriverProfile();
      setDriver(driverProfile);

      const savedStatus = localStorage.getItem('driverOnline');

      setIsOnline(
        savedStatus !== null
          ? savedStatus === 'true'
          : driverProfile.isAvailable === true
      );


      try {
        const ride = await rideService.getDriverCurrentRide();
        setCurrentRide(ride);
      } catch (rideErr) {
        if (rideErr.response?.status === 404) {
          setCurrentRide(null);
        } else {
          throw rideErr;
        }
      }

      if (driverProfile.isAvailable) {
        loadAvailableRides();
      } else {
        setAvailableRides([]);
      }

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
        return;
      }

      setError('Failed to load driver data');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRides = async () => {
    try {
      const rides = await rideService.getAvailableRideRequests();
      setAvailableRides(rides);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isOnline;
      await rideService.updateDriverAvailability(newStatus);

      localStorage.setItem('driverOnline', String(newStatus));
      setIsOnline(newStatus);

      if (newStatus) {
        loadAvailableRides();
      } else {
        setAvailableRides([]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update availability');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      await rideService.acceptRide(rideId);
      loadDriverData();
    } catch (err) {
      console.error(err);
      alert('Failed to accept ride');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('driverOnline');
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
        <h1>Driver Dashboard</h1>

        <div className="header-actions">
          <div className="flex items-center gap-md">
            <label style={{ position: 'relative', width: '60px', height: '30px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isOnline}
                onChange={toggleAvailability}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: isOnline ? 'var(--success)' : '#ccc',
                borderRadius: '30px',
                transition: 'var(--transition-normal)'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '22px',
                  width: '22px',
                  left: isOnline ? '32px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'var(--transition-normal)'
                }} />
              </span>
            </label>

            <span style={{
              fontWeight: 600,
              color: isOnline ? 'var(--success)' : 'var(--text-muted)'
            }}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>

          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </header>

      <div className="page-content">
        <div className="card">
          <h2 className="heading-lg">Welcome, {driver?.name}!</h2>
          <p className="text-secondary">
            You are currently {isOnline ? 'online and available for rides' : 'offline'}.
          </p>
        </div>

        {currentRide ? (
          <div className="card">
            <h2 className="heading-lg">Current Ride</h2>
            <div className="ride-card">
              <p><strong>Status:</strong> {currentRide.status}</p>
              <p><strong>From:</strong> {currentRide.pickupLocation}</p>
              <p><strong>To:</strong> {currentRide.dropoffLocation}</p>
              <p><strong>Fare:</strong> ₹{currentRide.fare}</p>
              <button onClick={() => navigate('/driver/current-ride')} className="btn btn-primary btn-full mt-md">
                Manage Ride
              </button>
            </div>
          </div>
        ) : isOnline ? (
          <div className="card">
            <h2 className="heading-lg">Available Ride Requests</h2>
            {availableRides.length === 0 ? (
              <p className="text-secondary text-center">No ride requests available.</p>
            ) : (
              availableRides.map((ride) => (
                <div key={ride.rideId} className="ride-card">
                  <p><strong>From:</strong> {ride.pickupLocation}</p>
                  <p><strong>To:</strong> {ride.dropoffLocation}</p>
                  <p><strong>Fare:</strong> ₹{ride.fare}</p>
                  <button onClick={() => acceptRide(ride.rideId)} className="btn btn-success btn-full">
                    Accept Ride
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="heading-lg">You're Offline</h2>
            <p className="text-secondary">Turn online to receive ride requests.</p>
          </div>
        )}

        <div className="card">
          <h3 className="heading-md">Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <button onClick={() => navigate('/driver/profile')} className="btn btn-secondary btn-lg">
              👤 My Profile
            </button>
            <button onClick={() => navigate('/driver/history')} className="btn btn-secondary btn-lg">
              📋 Ride History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
