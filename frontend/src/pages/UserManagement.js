import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Alert,
  Chip,
  Switch,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    is_active: true,
    is_admin: false,
    max_subscriptions: 10,
  });

  const queryClient = useQueryClient();

  // 获取用户列表
  const { data: users = [], error } = useQuery(
    'users',
    async () => {
      const response = await axios.get('/api/auth/users');
      return response.data;
    }
  );

  // 获取当前用户信息
  const { data: currentUser } = useQuery(
    'currentUser',
    async () => {
      const response = await axios.get('/api/auth/me');
      return response.data;
    }
  );

  // 创建用户
  const createMutation = useMutation(
    async (userData) => {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        handleClose();
      },
    }
  );

  // 更新用户
  const updateMutation = useMutation(
    async ({ id, userData }) => {
      const response = await axios.put(`/api/auth/users/${id}`, userData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        handleClose();
      },
      onError: (error) => {
        console.error('Update user error:', error.response?.data || error.message);
      },
    }
  );

  // 删除用户
  const deleteMutation = useMutation(
    async (id) => {
      await axios.delete(`/api/auth/users/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name || '',
        password: '',
        is_active: user.is_active,
        is_admin: user.is_admin,
        max_subscriptions: user.max_subscriptions || 10,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        is_active: true,
        is_admin: false,
        max_subscriptions: 10,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // 延迟清除编辑状态，避免可访问性问题
    setTimeout(() => {
      setEditingUser(null);
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 清理表单数据，移除空字符串和未更改的值
    const cleanFormData = { ...formData };

    // 如果是编辑模式且密码为空或null，则不发送密码字段
    if (editingUser && (!cleanFormData.password || cleanFormData.password === '')) {
      delete cleanFormData.password;
    }

    // 移除所有null和undefined值，只保留有意义的值
    Object.keys(cleanFormData).forEach(key => {
      if (cleanFormData[key] === null || cleanFormData[key] === undefined || cleanFormData[key] === '') {
        if (key !== 'password') { // 密码字段已经在上面处理
          delete cleanFormData[key];
        }
      }
    });

    console.log('Submitting user update:', cleanFormData);

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, userData: cleanFormData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return <Alert severity="error">加载用户列表失败: {error.message}</Alert>;
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 1,
            }}
          >
            用户管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            管理系统用户账户和权限
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(45deg, #a78bfa 30%, #8b5cf6 90%)',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #8b5cf6 30%, #7c3aed 90%)',
              boxShadow: '0 6px 20px rgba(167, 139, 250, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          创建新用户
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(167, 139, 250, 0.1)',
                    color: '#a78bfa',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总用户数
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(34, 211, 238, 0.1)',
                    color: '#22d3ee',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SuccessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {users.filter(user => user.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    活跃用户
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <AdminIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {users.filter(user => user.is_admin).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    管理员
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    安全级别
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    高
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            用户列表
          </Typography>
        </Box>

        <Box sx={{ p: 3, backgroundColor: 'rgba(167, 139, 250, 0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 2, color: '#a78bfa' }} />
            <Typography variant="body2">
              管理员可以创建、编辑和删除用户账户。注意：不能删除自己的账户。
            </Typography>
          </Box>
        </Box>

        {users.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(167, 139, 250, 0.1)',
                color: '#a78bfa',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <PeopleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无用户
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              创建第一个用户开始使用系统
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                background: 'linear-gradient(45deg, #a78bfa 30%, #8b5cf6 90%)',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              创建第一个用户
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(167, 139, 250, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>用户信息</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>邮箱地址</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>角色权限</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>订阅限制</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>账户状态</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(167, 139, 250, 0.03)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: user.is_admin
                              ? 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)'
                              : 'linear-gradient(45deg, #a78bfa 30%, #8b5cf6 90%)',
                            fontSize: '1rem',
                          }}
                        >
                          {user.is_admin ? <AdminIcon /> : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.full_name || '未设置全名'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={user.is_admin ? <AdminIcon /> : <PersonIcon />}
                        label={user.is_admin ? '管理员' : '普通用户'}
                        color={user.is_admin ? 'warning' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={`${user.max_subscriptions || 10} 个`}
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={user.is_active ? <SuccessIcon /> : <ErrorIcon />}
                        label={user.is_active ? '启用' : '禁用'}
                        color={user.is_active ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="编辑用户">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(user)}
                            sx={{
                              color: '#a78bfa',
                              '&:hover': { backgroundColor: 'rgba(167, 139, 250, 0.1)' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除用户">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            disabled={currentUser?.username === user.username}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                              '&:disabled': { color: 'rgba(0, 0, 0, 0.3)' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* User Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #a78bfa 30%, #8b5cf6 90%)',
            color: 'white',
            py: 3,
            '& .MuiTypography-root': {
              fontWeight: 700,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              {editingUser ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="span">
                {editingUser ? '编辑用户' : '创建新用户'}
              </Typography>
              <Typography variant="body2" component="div" sx={{ opacity: 0.9 }}>
                {editingUser ? '修改用户信息和权限' : '添加新的系统用户'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="用户名"
                  fullWidth
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={!!editingUser}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(167, 139, 250, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="全名"
                  fullWidth
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(167, 139, 250, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="邮箱地址"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(167, 139, 250, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  helperText={editingUser ? "留空则不修改密码" : "请设置安全密码"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(167, 139, 250, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="最大订阅数量"
                  type="number"
                  fullWidth
                  value={formData.max_subscriptions}
                  onChange={(e) => setFormData({ ...formData, max_subscriptions: parseInt(e.target.value) || 10 })}
                  inputProps={{ min: 1, max: 100 }}
                  helperText="该用户最多可以订阅的公开任务数量"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(167, 139, 250, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
                  <Switch
                    checked={formData.is_admin}
                    onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: formData.is_admin ? '#f59e0b' : 'default',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: formData.is_admin ? 'rgba(245, 158, 11, 0.5)' : 'default',
                      },
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      管理员权限
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      拥有系统管理权限
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: formData.is_active ? '#10b981' : 'default',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: formData.is_active ? 'rgba(16, 185, 129, 0.5)' : 'default',
                      },
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      启用账户
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      允许用户登录系统
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleClose}
              sx={{
                px: 3,
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              sx={{
                background: 'linear-gradient(45deg, #a78bfa 30%, #8b5cf6 90%)',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(167, 139, 250, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #8b5cf6 30%, #7c3aed 90%)',
                  boxShadow: '0 6px 20px rgba(167, 139, 250, 0.4)',
                },
              }}
            >
              {editingUser ? '更新用户' : '创建用户'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Footer GitHub Link */}
      <Box sx={{
        mt: 4,
        p: 3,
        textAlign: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          项目开源，欢迎贡献代码
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CodeIcon />}
          href="https://github.com/qfpqhyl"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: 'rgba(167, 139, 250, 0.5)',
            color: '#a78bfa',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#a78bfa',
              backgroundColor: 'rgba(167, 139, 250, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagement;