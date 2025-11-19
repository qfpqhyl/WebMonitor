import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as TestIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    smtp_server: '',
    smtp_port: '465',
    smtp_user: '',
    smtp_password: '',
    receiver_email: '',
    is_active: true,
    is_ssl: true,
  });

  const queryClient = useQueryClient();

  // 获取邮件配置列表
  const { data: emailConfigs = [] } = useQuery(
    'emailConfigs',
    async () => {
      const response = await axios.get('/api/email-configs');
      return response.data;
    }
  );

  // 创建邮件配置
  const createConfigMutation = useMutation(
    async (configData) => {
      const response = await axios.post('/api/email-configs', configData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
        setOpenDialog(false);
        resetForm();
      },
    }
  );

  // 更新邮件配置
  const updateConfigMutation = useMutation(
    async ({ id, ...configData }) => {
      const response = await axios.put(`/api/email-configs/${id}`, configData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
        setOpenDialog(false);
        resetForm();
      },
    }
  );

  // 删除邮件配置
  const deleteConfigMutation = useMutation(
    async (id) => {
      await axios.delete(`/api/email-configs/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
      },
    }
  );

  // 测试邮件配置
  const testConfigMutation = useMutation(
    async (configId) => {
      const response = await axios.post(`/api/email-configs/${configId}/test`);
      return response.data;
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      smtp_server: '',
      smtp_port: '465',
      smtp_user: '',
      smtp_password: '',
      receiver_email: '',
      is_active: true,
      is_ssl: true,
    });
    setEditingConfig(null);
  };

  const handleOpenDialog = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        name: config.name,
        smtp_server: config.smtp_server,
        smtp_port: config.smtp_port,
        smtp_user: config.smtp_user,
        smtp_password: config.smtp_password,
        receiver_email: config.receiver_email,
        is_active: config.is_active,
        is_ssl: config.is_ssl,
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (editingConfig) {
      updateConfigMutation.mutate({ id: editingConfig.id, ...formData });
    } else {
      createConfigMutation.mutate(formData);
    }
  };

  const handleTestConfig = (configId) => {
    testConfigMutation.mutate(configId);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系统设置
      </Typography>

      <Grid container spacing={3}>
        {/* 邮件配置管理 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                系统设置
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                添加邮件配置
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              在这里管理系统设置。系统会使用当前启用的配置发送监控通知。
            </Alert>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>配置名称</TableCell>
                    <TableCell>SMTP服务器</TableCell>
                    <TableCell>发件人邮箱</TableCell>
                    <TableCell>接收者邮箱</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emailConfigs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>{config.name}</TableCell>
                      <TableCell>{config.smtp_server}:{config.smtp_port}</TableCell>
                      <TableCell>{config.smtp_user}</TableCell>
                      <TableCell>{config.receiver_email}</TableCell>
                      <TableCell>
                        <Chip
                          label={config.is_active ? '已启用' : '已禁用'}
                          color={config.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(config)}
                          title="编辑"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleTestConfig(config.id)}
                          title="测试连接"
                          disabled={testConfigMutation.isLoading}
                        >
                          <TestIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteConfigMutation.mutate(config.id)}
                          title="删除"
                          disabled={deleteConfigMutation.isLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emailConfigs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" py={2}>
                          暂无邮件配置，点击"添加邮件配置"按钮创建新的配置
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                操作失败: {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error).message}
              </Alert>
            )}

            {testConfigMutation.data && (
              <Alert
                severity={testConfigMutation.data.success ? 'success' : 'error'}
                sx={{ mt: 2 }}
              >
                {testConfigMutation.data.message || testConfigMutation.data.error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* 系统信息 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              系统信息
            </Typography>

            <Box sx={{ '& > *': { mb: 1 } }}>
              <Typography variant="body2">
                <strong>前端版本:</strong> React + MUI
              </Typography>
              <Typography variant="body2">
                <strong>后端版本:</strong> FastAPI + SQLite
              </Typography>
              <Typography variant="body2">
                <strong>监控引擎:</strong> Selenium WebDriver
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <strong>数据存储:</strong> SQLite
              </Typography>
              <Typography variant="body2">
                <strong>调度系统:</strong> APScheduler
              </Typography>
              <Typography variant="body2">
                <strong>邮件协议:</strong> SMTP SSL/TLS
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              使用帮助
            </Typography>

            <Box sx={{ '& > *': { mb: 1 } }}>
              <Typography variant="body2">
                <strong>1. 添加监控任务:</strong> 在"监控任务"页面添加要监控的网页和XPath
              </Typography>
              <Typography variant="body2">
                <strong>2. 获取XPath:</strong> 右键点击网页元素 → 检查 → 右键 → Copy XPath
              </Typography>
              <Typography variant="body2">
                <strong>3. 配置邮件:</strong> 在设置页面添加邮件配置并测试连接
              </Typography>
              <Typography variant="body2">
                <strong>4. 查看日志:</strong> 在"监控日志"页面查看监控历史
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 邮件配置对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingConfig ? '编辑邮件配置' : '添加邮件配置'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="配置名称"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SMTP服务器"
                fullWidth
                value={formData.smtp_server}
                onChange={(e) => setFormData({ ...formData, smtp_server: e.target.value })}
                required
                placeholder="smtp.example.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SMTP端口"
                fullWidth
                type="number"
                value={formData.smtp_port}
                onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) || '' })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="发件人邮箱"
                fullWidth
                type="email"
                value={formData.smtp_user}
                onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SMTP密码"
                type="password"
                fullWidth
                value={formData.smtp_password}
                onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                required
                helperText="建议使用应用专用密码"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="接收者邮箱"
                fullWidth
                type="email"
                value={formData.receiver_email}
                onChange={(e) => setFormData({ ...formData, receiver_email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="启用此配置"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_ssl}
                    onChange={(e) => setFormData({ ...formData, is_ssl: e.target.checked })}
                  />
                }
                label="使用SSL加密"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createConfigMutation.isLoading || updateConfigMutation.isLoading}
          >
            {editingConfig ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
