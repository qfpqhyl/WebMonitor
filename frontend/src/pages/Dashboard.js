import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

import StatCard from '../components/StatCard';

const Dashboard = () => {
  // 获取监控任务统计
  const { data: tasks = [] } = useQuery(
    'monitor-tasks',
    async () => {
      const response = await axios.get('/api/monitor-tasks');
      return response.data;
    }
  );

  // 计算统计数据
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => task.is_active).length;
  const inactiveTasks = totalTasks - activeTasks;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        仪表板
      </Typography>

      <Grid container spacing={3}>
        {/* 统计卡片 */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="总任务数"
            value={totalTasks}
            icon={<TaskIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="活跃任务"
            value={activeTasks}
            icon={<SuccessIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="非活跃任务"
            value={inactiveTasks}
            icon={<ErrorIcon />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="系统状态"
            value="正常"
            icon={<UpdateIcon />}
            color="#ed6c02"
          />
        </Grid>

        {/* 最近活动 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              最近监控活动
            </Typography>
            <Typography variant="body2" color="text.secondary">
              暂无监控活动记录
            </Typography>
          </Paper>
        </Grid>

        {/* 系统信息 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              系统信息
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>服务状态:</strong> 运行中
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>监控服务:</strong> 活跃
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>邮件服务:</strong> 已配置
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>数据库:</strong> SQLite
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;