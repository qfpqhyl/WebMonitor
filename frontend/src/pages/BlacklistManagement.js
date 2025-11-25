import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const BlacklistManagement = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [formData, setFormData] = useState({
    domain: '',
    description: '',
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 获取黑名单列表
  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blacklist-domains');
      setDomains(response.data);
    } catch (error) {
      console.error('获取黑名单失败:', error);
      setSnackbar({
        open: true,
        message: '获取黑名单失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // 打开对话框
  const handleOpenDialog = (domain = null) => {
    setEditingDomain(domain);
    setFormData({
      domain: domain?.domain || '',
      description: domain?.description || '',
      is_active: domain?.is_active ?? true,
    });
    setDialogOpen(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDomain(null);
    setFormData({
      domain: '',
      description: '',
      is_active: true,
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      if (editingDomain) {
        // 更新黑名单
        await axios.put(`/api/blacklist-domains/${editingDomain.id}`, formData);
        setSnackbar({
          open: true,
          message: '黑名单更新成功',
          severity: 'success',
        });
      } else {
        // 创建黑名单
        await axios.post('/api/blacklist-domains', formData);
        setSnackbar({
          open: true,
          message: '黑名单添加成功',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchDomains();
    } catch (error) {
      console.error('保存失败:', error);
      setSnackbar({
        open: true,
        message: '保存失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    }
  };

  // 删除黑名单
  const handleDelete = async (domainId) => {
    if (window.confirm('确定要删除这个黑名单域名吗？')) {
      try {
        await axios.delete(`/api/blacklist-domains/${domainId}`);
        setSnackbar({
          open: true,
          message: '黑名单删除成功',
          severity: 'success',
        });
        fetchDomains();
      } catch (error) {
        console.error('删除失败:', error);
        setSnackbar({
          open: true,
          message: '删除失败: ' + (error.response?.data?.detail || '未知错误'),
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
      field: 'domain',
      headerName: '域名',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: '描述',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'is_active',
      headerName: '状态',
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? '启用' : '禁用'}
          color={params.value ? 'success' : 'default'}
          icon={params.value ? <CheckCircleIcon /> : <BlockIcon />}
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: '创建时间',
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
          <Tooltip title="编辑">
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(params.row)}
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
          <Tooltip title="删除">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
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
      {/* 页面标题和操作 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              黑名单管理
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              管理禁止普通用户监控的网站域名
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            },
          }}
        >
          添加域名
        </Button>
      </Box>

      {/* 说明卡片 */}
      <Card sx={{ mb: 3, backgroundColor: alpha('#1976d2', 0.04), border: `1px solid ${alpha('#1976d2', 0.12)}` }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SecurityIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              功能说明
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 普通用户无法监控黑名单中的域名
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 管理员可以监控任何网站，包括黑名单中的域名
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 黑名单支持通配符匹配（如 *.example.com 会阻止所有子域名）
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 支持部分匹配（如 example 会阻止包含 example 的所有域名）
          </Typography>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={domains}
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

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h5" component="div">
              {editingDomain ? '编辑黑名单域名' : '添加黑名单域名'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="域名"
            fullWidth
            variant="outlined"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="例如: example.com, *.example.com, example"
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="可选的域名描述信息"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                color="primary"
              />
            }
            label="启用状态"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.domain.trim()}
          >
            {editingDomain ? '更新' : '添加'}
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

export default BlacklistManagement;