import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 使用表单数据格式进行登录
      const formFormData = new FormData();
      formFormData.append('username', formData.username);
      formFormData.append('password', formData.password);

      const response = await axios.post('/api/auth/login', formFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token, user } = response.data;

      // 使用AuthContext的login方法
      login(user, access_token);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        '登录失败，请检查用户名和密码'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h4" gutterBottom>
            WebMonitor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            网页内容监控通知系统
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              size="large"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              首次使用请联系管理员创建账户
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;