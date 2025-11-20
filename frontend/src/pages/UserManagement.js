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
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    is_active: true,
    is_admin: false,
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
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, userData: formData });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          用户管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          添加用户
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        管理员可以创建、编辑和删除用户账户。注意：不能删除自己的账户。
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>全名</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.is_admin ? '管理员' : '普通用户'}
                    color={user.is_admin ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? '启用' : '禁用'}
                    color={user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(user)}
                    title="编辑"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(user.id)}
                    title="删除"
                    color="error"
                    disabled={currentUser?.id === user.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 添加/编辑用户对话框 */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? '编辑用户' : '添加用户'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="用户名"
                  fullWidth
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={!!editingUser} // 编辑时禁用用户名
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="邮箱"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!!editingUser} // 编辑时禁用邮箱
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="全名"
                  fullWidth
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="密码"
                  fullWidth
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  helperText={editingUser ? '留空则不修改密码' : '至少6位字符'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                  }
                  label="启用用户"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_admin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_admin: e.target.checked,
                        })
                      }
                    />
                  }
                  label="管理员权限"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingUser ? '更新' : '添加'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {(createMutation.error || updateMutation.error || deleteMutation.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          操作失败: {(createMutation.error || updateMutation.error || deleteMutation.error).message}
        </Alert>
      )}
    </Box>
  );
};

export default UserManagement;