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
  Switch,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
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
  Mail as MailIcon,
  Security as SecurityIcon,
  CheckCircle as SuccessIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const EmailConfig = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    smtp_server: '',
    smtp_port: '465',
    smtp_user: '',
    smtp_password: '',
    receiver_email: '',
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
            系统设置
          </Typography>
          <Typography variant="body1" color="text.secondary">
            配置邮件通知和系统参数
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          添加邮件配置
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
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <MailIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {emailConfigs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    邮件配置
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
                  <SuccessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {emailConfigs.filter(c => c.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    活跃配置
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
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    SSL/TLS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    安全连接
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
                    bgcolor: 'rgba(167, 139, 250, 0.1)',
                    color: '#a78bfa',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SettingsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    已配置
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    系统设置
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Configurations */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            SMTP邮件配置
          </Typography>
        </Box>

        <Box sx={{ p: 3, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 2, color: '#2563eb' }} />
            <Typography variant="body2">
              配置SMTP邮件服务器，系统将在监控到内容变化时发送通知邮件。支持多个邮件配置，在创建监控任务时可以选择使用哪个配置。
            </Typography>
          </Box>
        </Box>

        {emailConfigs.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <MailIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无邮件配置
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              添加第一个邮件配置开始使用通知功能
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              创建第一个配置
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>配置详情</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>发送邮箱</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>接收邮箱</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2, textAlign: 'center' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailConfigs.map((config) => (
                  <TableRow
                    key={config.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.03)' },
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
                            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                            fontSize: '1rem',
                          }}
                        >
                          {config.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {config.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {config.smtp_server}:{config.smtp_port} {config.is_ssl ? 'SSL' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {config.smtp_user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SMTP发送账户
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {config.receiver_email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            通知接收账户
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="测试连接">
                          <IconButton
                            size="small"
                            onClick={() => handleTestConfig(config.id)}
                            disabled={testConfigMutation.isLoading}
                            sx={{
                              color: '#2563eb',
                              '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                            }}
                          >
                            <TestIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑配置">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(config)}
                            sx={{
                              color: '#10b981',
                              '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除配置">
                          <IconButton
                            size="small"
                            onClick={() => deleteConfigMutation.mutate(config.id)}
                            disabled={deleteConfigMutation.isLoading}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
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

        {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error) && (
          <Alert
            severity="error"
            sx={{ m: 3, borderRadius: 2 }}
            variant="filled"
          >
            操作失败: {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error).message}
          </Alert>
        )}

        {testConfigMutation.data && (
          <Alert
            severity={testConfigMutation.data.success ? 'success' : 'error'}
            sx={{ m: 3, borderRadius: 2 }}
            variant="filled"
          >
            {testConfigMutation.data.message || testConfigMutation.data.error}
          </Alert>
        )}
      </Paper>

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
                        <li>保存配置</li>
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

      {/* Enhanced Email Configuration Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
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
              {editingConfig ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="span">
                {editingConfig ? '编辑邮件配置' : '创建邮件配置'}
              </Typography>
              <Typography variant="body2" component="div" sx={{ opacity: 0.9 }}>
                配置SMTP邮件服务器发送通知
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="配置名称"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
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
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SMTP密码"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.smtp_password}
                  onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                  required
                  helperText="建议使用应用专用密码以提高安全性"
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
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
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
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                  <Switch
                    checked={formData.is_ssl}
                    onChange={(e) => setFormData({ ...formData, is_ssl: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: formData.is_ssl ? '#2563eb' : 'default',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: formData.is_ssl ? 'rgba(37, 99, 235, 0.5)' : 'default',
                      },
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      使用SSL加密
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      启用SSL/TLS加密连接确保邮件传输安全
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
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
              disabled={createConfigMutation.isLoading || updateConfigMutation.isLoading}
              sx={{
                background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                },
              }}
            >
              {editingConfig ? '更新配置' : '创建配置'}
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
            borderColor: 'rgba(37, 99, 235, 0.5)',
            color: '#2563eb',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default EmailConfig;
