/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Modules';
import LessonView from './pages/LessonView';
import Assignments from './pages/Assignments';
import Progress from './pages/Progress';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Milestones from './pages/Milestones';
import Admin from './pages/Admin';
import StudentSpace from './pages/StudentSpace';
import MentorWorkspace from './pages/Mentor';

function AppRoutes() {
  const { isStudentMode, currentUser } = useApp();
  
  // Choose core dashboard content depending on authenticated role
  const getRootElement = () => {
    if (!currentUser) return <Dashboard />;
    if (currentUser.isMentor) return <MentorWorkspace />;
    if (isStudentMode || currentUser.isStudent) return <StudentSpace />;
    return <Dashboard />;
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={getRootElement()} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:moduleId/:lessonId" element={<LessonView />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<StudentSpace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
