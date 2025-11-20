import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MonitorTasks from './pages/MonitorTasks';
import MonitorLogs from './pages/MonitorLogs';
import EmailConfig from './pages/EmailConfig';
import UserManagement from './pages/UserManagement';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 创建MUI主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* 登录页面 - 不需要认证 */}
              <Route path="/login" element={<Login />} />

              {/* 仪表板 */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />

              {/* 监控任务 */}
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Layout><MonitorTasks /></Layout>
                </ProtectedRoute>
              } />

              {/* 监控日志 */}
              <Route path="/logs" element={
                <ProtectedRoute>
                  <Layout><MonitorLogs /></Layout>
                </ProtectedRoute>
              } />

              {/* 邮件通知配置 */}
              <Route path="/email-config" element={
                <ProtectedRoute>
                  <Layout><EmailConfig /></Layout>
                </ProtectedRoute>
              } />

              {/* 用户管理 - 仅管理员 */}
              <Route path="/user-management" element={
                <ProtectedRoute adminOnly>
                  <Layout><UserManagement /></Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;