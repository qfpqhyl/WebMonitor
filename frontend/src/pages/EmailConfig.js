import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
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
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as TestIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const EmailConfig = () => {
  const [currentTab, setCurrentTab] = useState(0);
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

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系统设置
      </Typography>

      {/* 标签页导航 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="邮件配置" icon={<InfoIcon />} />
          <Tab label="系统信息" icon={<InfoIcon />} />
          <Tab label="使用帮助" icon={<HelpIcon />} />
        </Tabs>
      </Paper>

      {/* 邮件配置页面 */}
      {currentTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              SMTP邮件配置管理
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
            配置SMTP邮件服务器，系统将在监控到内容变化时发送通知邮件。支持多个邮件配置，但只有启用状态的配置会被使用。
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
      )}

      {/* 系统信息页面 */}
      {currentTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                系统技术栈
              </Typography>

              <Box sx={{ '& > *': { mb: 2 } }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">前端技术</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ '& > *': { mb: 1 } }}>
                      <Typography variant="body2">
                        <strong>框架:</strong> React 18.2.0
                      </Typography>
                      <Typography variant="body2">
                        <strong>UI库:</strong> Material-UI 5.15.0
                      </Typography>
                      <Typography variant="body2">
                        <strong>路由:</strong> React Router 6.20.1
                      </Typography>
                      <Typography variant="body2">
                        <strong>HTTP客户端:</strong> Axios 1.6.2
                      </Typography>
                      <Typography variant="body2">
                        <strong>状态管理:</strong> React Query 3.39.3
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">后端技术</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ '& > *': { mb: 1 } }}>
                      <Typography variant="body2">
                        <strong>Web框架:</strong> FastAPI 0.104.1
                      </Typography>
                      <Typography variant="body2">
                        <strong>服务器:</strong> Uvicorn 0.24.0
                      </Typography>
                      <Typography variant="body2">
                        <strong>数据库:</strong> SQLite / PostgreSQL
                      </Typography>
                      <Typography variant="body2">
                        <strong>ORM:</strong> SQLAlchemy 2.0.23
                      </Typography>
                      <Typography variant="body2">
                        <strong>数据验证:</strong> Pydantic 2.5.0
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">监控与调度</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ '& > *': { mb: 1 } }}>
                      <Typography variant="body2">
                        <strong>网页抓取:</strong> Selenium WebDriver 4.15.2
                      </Typography>
                      <Typography variant="body2">
                        <strong>任务调度:</strong> APScheduler 3.10.4
                      </Typography>
                      <Typography variant="body2">
                        <strong>邮件协议:</strong> SMTP SSL/TLS
                      </Typography>
                      <Typography variant="body2">
                        <strong>内容解析:</strong> XPath选择器
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                系统特性
              </Typography>

              <Box sx={{ '& > *': { mb: 2 } }}>
                <Alert severity="success">
                  <Typography variant="subtitle2">实时监控</Typography>
                  <Typography variant="body2">
                    支持自定义监控间隔，最小可设置10秒检查一次
                  </Typography>
                </Alert>

                <Alert severity="info">
                  <Typography variant="subtitle2">智能内容检测</Typography>
                  <Typography variant="body2">
                    基于XPath精确定位网页元素，自动检测内容变化
                  </Typography>
                </Alert>

                <Alert severity="warning">
                  <Typography variant="subtitle2">多邮件配置</Typography>
                  <Typography variant="body2">
                    支持多个邮件服务器配置，灵活切换通知渠道
                  </Typography>
                </Alert>

                <Alert severity="error">
                  <Typography variant="subtitle2">历史记录</Typography>
                  <Typography variant="body2">
                    完整的监控日志记录，支持查询历史监控数据
                  </Typography>
                </Alert>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 使用帮助页面 */}
      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                快速入门指南
              </Typography>

              <Box sx={{ '& > *': { mb: 3 } }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">1. 添加监控任务</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" component="div">
                      <ol>
                        <li>访问"监控任务"页面</li>
                        <li>点击"添加任务"按钮</li>
                        <li>填写任务名称、监控URL</li>
                        <li>设置XPath选择器来定位要监控的元素</li>
                        <li>配置检查间隔（建议不少于60秒）</li>
                        <li>启用监控并保存</li>
                      </ol>
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">2. 获取XPath选择器</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" component="div">
                      <strong>Chrome浏览器方法:</strong>
                      <ol>
                        <li>打开要监控的网页</li>
                        <li>右键点击要监控的元素</li>
                        <li>选择"检查"（Inspect）</li>
                        <li>在开发者工具中右键高亮的HTML代码</li>
                        <li>选择"Copy" → "Copy XPath"</li>
                      </ol>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        建议选择具有稳定ID或class的元素，避免使用动态生成的XPath
                      </Alert>
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">3. 配置邮件通知</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" component="div">
                      <ol>
                        <li>在当前页面的"邮件配置"标签中添加SMTP配置</li>
                        <li>填写SMTP服务器地址和端口</li>
                        <li>输入发件人和收件人邮箱</li>
                        <li>建议使用应用专用密码而非主密码</li>
                        <li>点击"测试连接"验证配置</li>
                        <li>启用配置并保存</li>
                      </ol>
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">4. 查看监控日志</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" component="div">
                      <ol>
                        <li>访问"监控日志"页面</li>
                        <li>查看所有任务的执行历史</li>
                        <li>监控成功/失败记录</li>
                        <li>内容变化检测记录</li>
                        <li>错误信息和调试信息</li>
                      </ol>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                常见问题
              </Typography>

              <Box sx={{ '& > *': { mb: 2 } }}>
                <Alert severity="info">
                  <Typography variant="subtitle2">Q: 监控不生效怎么办？</Typography>
                  <Typography variant="body2">
                    A: 检查任务是否启用，XPath是否正确，网络是否正常
                  </Typography>
                </Alert>

                <Alert severity="warning">
                  <Typography variant="subtitle2">Q: 邮件发送失败？</Typography>
                  <Typography variant="body2">
                    A: 验证SMTP配置，检查邮箱密码，确认网络连接
                  </Typography>
                </Alert>

                <Alert severity="error">
                  <Typography variant="subtitle2">Q: XPath如何验证？</Typography>
                  <Typography variant="body2">
                    A: 使用浏览器开发者工具Console测试：$x("your_xpath")
                  </Typography>
                </Alert>

                <Alert severity="success">
                  <Typography variant="subtitle2">Q: 监控频率建议？</Typography>
                  <Typography variant="body2">
                    A: 建议60秒以上间隔，避免对目标网站造成过大压力
                  </Typography>
                </Alert>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

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

export default EmailConfig;
