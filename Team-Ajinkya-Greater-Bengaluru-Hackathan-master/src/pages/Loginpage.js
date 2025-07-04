import React, { useState } from 'react';
import StudentLogin from '../components/Slogin';
import TeacherLogin from '../components/Tlogin';
import Layoutt from '../components/exam';
import Dashboard from '../components/Dashboard'; // Import the Dashboard component

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleStudentLogin = (studentCredentials) => {
    // Simulate a successful login
    setLoggedInUser({ role: 'student', ...studentCredentials });
  };

  const handleTeacherLogin = (teacherCredentials) => {
    // Simulate a successful login
    setLoggedInUser({ role: 'teacher', ...teacherCredentials });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // Render content based on user role
  const renderContent = () => {
    if (!loggedInUser) {
      return (
        <>
          <h1>Login Page</h1>
          <StudentLogin onLogin={handleStudentLogin} />
          <TeacherLogin onLogin={handleTeacherLogin} />
        </>
      );
    } else if (loggedInUser.role === 'student') {
      return <Layoutt user={loggedInUser} onLogout={handleLogout} />;
    } else if (loggedInUser.role === 'teacher') {
      return <Dashboard user={loggedInUser} onLogout={handleLogout} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default LoginPage;