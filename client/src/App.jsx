import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import CoordinatorDashboard from '@/pages/coordinator/CoordinatorDashboard'
import ParticipantDashboard from '@/pages/participant/ParticipantDashboard'
import EvaluatorDashboard from '@/pages/evaluator/EvaluatorDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'   // <-- added

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/coordinator" element={
            <ProtectedRoute roles={['coordinator']}>
              <Layout><CoordinatorDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/participant" element={
            <ProtectedRoute roles={['participant']}>
              <Layout><ParticipantDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/evaluator" element={
            <ProtectedRoute roles={['evaluator']}>
              <Layout><EvaluatorDashboard /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
