import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Divider,
  Avatar,
  alpha,
  IconButton,
  Tooltip,
  Button,
  Container,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as SuccessIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  NotificationsActive as NotificationsIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import StatCard from '../components/StatCard';

dayjs.extend(relativeTime);

const Dashboard = () => {
  // 获取监控任务统计
  const { data: tasks = [], refetch: refetchTasks } = useQuery(
    'monitor-tasks',
    async () => {
      const response = await axios.get('/api/monitor-tasks');
      return response.data;
    },
    {
      refetchInterval: 60000, // 每分钟刷新一次
    }
  );

  // 获取最新监控日志
  const { data: logs = [], isLoading: logsLoading, refetch: refetchLogs } = useQuery(
    'latest-monitor-logs',
    async () => {
      const response = await axios.get('/api/monitor-logs/latest?limit=10');
      return response.data;
    },
    {
      refetchInterval: 30000, // 每30秒刷新一次
    }
  );

  // 计算统计数据
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => task.is_active).length;
  const successRate = logs.length > 0
    ? Math.round((logs.filter(log => !log.error_message).length / logs.length) * 100)
    : 100;

  const recentChanges = logs.filter(log => log.is_changed).length;
  const averageResponseTime = 1.2; // 模拟数据，实际应该从API获取

  const handleRefresh = () => {
    refetchTasks();
    refetchLogs();
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 4,
            mb: 4,
            p: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 25% 25%, ${alpha('#10b981', 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, ${alpha('#2563eb', 0.1)} 0%, transparent 50%)`,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography
                  variant="overline"
                  component="div"
                  sx={{
                    color: '#10b981',
                    fontWeight: 'bold',
                    mb: 1,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  监控概览
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  仪表板
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 1 }}>
                  实时监控您的网页内容变化
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="刷新数据">
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                    {totalTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    总任务数
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#22d3ee', fontWeight: 'bold' }}>
                    {activeTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    活跃任务
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#a78bfa', fontWeight: 'bold' }}>
                    {recentChanges}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    最近变化
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 'bold' }}>
                    {successRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    成功率
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="总任务数"
              value={totalTasks}
              icon={<TaskIcon />}
              color="#10b981"
              subtitle="所有监控任务"
              trend={totalTasks > 0 ? 12 : 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="活跃任务"
              value={activeTasks}
              icon={<SuccessIcon />}
              color="#22d3ee"
              subtitle="正在运行的任务"
              trend={activeTasks > 0 ? 8 : 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="最近变化"
              value={recentChanges}
              icon={<TrendingUpIcon />}
              color="#a78bfa"
              subtitle="检测到的内容变化"
              trend={recentChanges > 0 ? 15 : 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="成功率"
              value={`${successRate}%`}
              icon={<SpeedIcon />}
              color="#34d399"
              subtitle="监控执行成功率"
              trend={successRate > 90 ? 5 : 0}
            />
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Recent Activity */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: 4,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  最近监控活动
                </Typography>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  sx={{
                    color: '#10b981',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                  }}
                >
                  查看全部
                </Button>
              </Box>

              {logsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                  <CircularProgress sx={{ color: '#10b981' }} />
                </Box>
              ) : logs.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 6 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: '#1a1a1a', mb: 1 }}>
                    暂无监控活动
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    开始创建监控任务后，这里将显示活动记录
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {logs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <ListItem
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 2,
                          px: 0,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                            borderRadius: 2,
                          },
                        }}
                      >
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              background: log.is_changed
                                ? 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)'
                                : 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                            }}
                          >
                            {log.is_changed ? <TrendingUpIcon /> : <SuccessIcon />}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Chip
                                size="small"
                                label={`任务 #${log.task_id}`}
                                sx={{
                                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                  color: '#2563eb',
                                  fontWeight: 'bold',
                                  mr: 1,
                                }}
                              />
                              <Chip
                                size="small"
                                icon={log.is_changed ? <TrendingUpIcon /> : <SuccessIcon />}
                                label={log.is_changed ? '内容变化' : '无变化'}
                                color={log.is_changed ? 'warning' : 'success'}
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              <TimeIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {dayjs(log.check_time).fromNow()}
                            </Typography>
                          </Box>
                        </Box>

                        {log.error_message ? (
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              borderRadius: 2,
                              width: '100%',
                            }}
                          >
                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                              错误: {log.error_message}
                            </Typography>
                          </Box>
                        ) : log.is_changed && log.new_content ? (
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              borderRadius: 2,
                              width: '100%',
                            }}
                          >
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500, mb: 1 }}>
                              检测到内容变化
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              新内容预览: {log.new_content.substring(0, 150)}
                              {log.new_content.length > 150 ? '...' : ''}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            内容未发生变化
                          </Typography>
                        )}
                      </ListItem>
                      {index < logs.length - 1 && (
                        <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.06)' }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Quick Actions & System Info */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                    快速操作
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<TaskIcon />}
                      href="/tasks"
                      sx={{
                        background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                        },
                      }}
                    >
                      管理监控任务
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<NotificationsIcon />}
                      href="/email-config"
                      sx={{
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: '#1d4ed8',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        },
                      }}
                    >
                      配置邮件通知
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<VisibilityIcon />}
                      href="/logs"
                      sx={{
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: '#7c3aed',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      查看详细日志
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* System Status */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                    系统状态
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                          }}
                        >
                          <SecurityIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            监控引擎
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            基于 Selenium
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        size="small"
                        label="正常"
                        color="success"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                            color: '#22d3ee',
                          }}
                        >
                          <NotificationsIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            通知服务
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            邮件通知
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        size="small"
                        label="活跃"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            backgroundColor: 'rgba(167, 139, 250, 0.1)',
                            color: '#a78bfa',
                          }}
                        >
                          <SpeedIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            响应时间
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            平均 {averageResponseTime}s
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        size="small"
                        label="优秀"
                        color="success"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Footer GitHub Link */}
      <Box sx={{
        py: 3,
        px: 3,
        textAlign: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          WebMonitor 开源项目，欢迎贡献代码
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CodeIcon />}
          href="https://github.com/qfpqhyl"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: 'rgba(16, 185, 129, 0.5)',
            color: '#10b981',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;