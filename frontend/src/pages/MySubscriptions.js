import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Subscriptions as SubscriptionsIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
  Notifications as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    is_active: true,
    email_config_id: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 获取订阅列表
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('获取订阅列表失败:', error);
      setSnackbar({
        open: true,
        message: '获取订阅列表失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取邮箱配置列表
  const fetchEmailConfigs = async () => {
    try {
      const response = await axios.get('/api/email-configs');
      setEmailConfigs(response.data);
    } catch (error) {
      console.error('获取邮箱配置失败:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchEmailConfigs();
  }, []);

  // 打开编辑对话框
  const handleOpenEditDialog = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      is_active: subscription.is_active,
      email_config_id: subscription.email_config_id,
    });
    setEditDialogOpen(true);
  };

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingSubscription(null);
    setFormData({
      is_active: true,
      email_config_id: null,
    });
  };

  // 更新订阅
  const handleUpdateSubscription = async () => {
    try {
      await axios.put(`/api/subscriptions/${editingSubscription.id}`, formData);

      setSnackbar({
        open: true,
        message: '订阅更新成功',
        severity: 'success',
      });

      handleCloseEditDialog();
      fetchSubscriptions();
    } catch (error) {
      console.error('更新订阅失败:', error);
      setSnackbar({
        open: true,
        message: '更新订阅失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    }
  };

  // 取消订阅
  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('确定要取消这个订阅吗？')) {
      try {
        await axios.delete(`/api/subscriptions/${subscriptionId}`);

        setSnackbar({
          open: true,
          message: '订阅取消成功',
          severity: 'success',
        });

        fetchSubscriptions();
      } catch (error) {
        console.error('取消订阅失败:', error);
        setSnackbar({
          open: true,
          message: '取消订阅失败: ' + (error.response?.data?.detail || '未知错误'),
          severity: 'error',
        });
      }
    }
  };

  // 关闭提示
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 表格列定义
  const columns = [
    {
      field: 'task_name',
      headerName: '任务名称',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SubscriptionsIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'task_url',
      headerName: '监控URL',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'is_active',
      headerName: '通知状态',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? '已启用' : '已停用'}
          color={params.value ? 'success' : 'default'}
          icon={params.value ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
          variant="outlined"
        />
      ),
    },
    {
      field: 'email_config_id',
      headerName: '邮箱配置',
      width: 150,
      renderCell: (params) => {
        const config = emailConfigs.find(c => c.id === params.value);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {config ? config.name : '默认配置'}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'created_at',
      headerName: '订阅时间',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="编辑订阅">
            <IconButton
              size="small"
              onClick={() => handleOpenEditDialog(params.row)}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: alpha('#1976d2', 0.08),
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="取消订阅">
            <IconButton
              size="small"
              onClick={() => handleDeleteSubscription(params.row.id)}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha('#d32f2f', 0.08),
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* 页面标题 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SubscriptionsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              我的订阅
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              管理您订阅的公开任务和通知设置
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 说明卡片 */}
      <Card sx={{ mb: 3, backgroundColor: alpha('#1976d2', 0.04), border: `1px solid ${alpha('#1976d2', 0.12)}` }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SettingsIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              订阅管理说明
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 启用通知后，当订阅的任务内容发生变化时将收到邮件通知
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 可以为每个订阅单独配置邮箱通知设置
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 停用通知后将不再收到邮件，但订阅记录会保留
          </Typography>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={subscriptions}
            columns={columns}
            loading={loading}
            disableSelectionOnClick
            disableDensitySelector
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha('#1976d2', 0.02),
                borderBottom: `2px solid ${alpha('#1976d2', 0.1)}`,
                fontSize: '0.875rem',
                fontWeight: 600,
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${alpha('#000', 0.06)}`,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: alpha('#1976d2', 0.02),
              },
            }}
            getRowId={(row) => row.id}
            autoHeight
            hideFooter
          />
        </CardContent>
      </Card>

      {/* 编辑订阅对话框 */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h5" component="div">
              编辑订阅设置
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingSubscription && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                任务：{editingSubscription.task_name}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label="启用邮件通知"
                sx={{ mb: 2 }}
              />

              {formData.is_active && (
                <TextField
                  select
                  fullWidth
                  label="邮箱配置"
                  value={formData.email_config_id || ''}
                  onChange={(e) => setFormData({ ...formData, email_config_id: e.target.value || null })}
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  <option value="">使用默认配置</option>
                  {emailConfigs.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.name} ({config.smtp_user})
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditDialog} color="inherit">
            取消
          </Button>
          <Button onClick={handleUpdateSubscription} variant="contained">
            保存设置
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MySubscriptions;