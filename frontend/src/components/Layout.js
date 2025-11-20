import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  History as LogIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Monitor as MonitorIcon,
  NotificationsActive as NotificationsIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  {
    text: '仪表板',
    icon: <DashboardIcon />,
    path: '/dashboard',
    description: '监控概览',
  },
  {
    text: '监控任务',
    icon: <TaskIcon />,
    path: '/tasks',
    description: '管理任务',
  },
  {
    text: '监控日志',
    icon: <LogIcon />,
    path: '/logs',
    description: '查看日志',
  },
  {
    text: '邮件配置',
    icon: <MailIcon />,
    path: '/email-config',
    description: '通知设置',
  },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  // 动态生成菜单项（管理员显示用户管理）
  const dynamicMenuItems = isAdmin() ? [
    ...menuItems,
    {
      text: '用户管理',
      icon: <PeopleIcon />,
      path: '/user-management',
      description: '用户管理',
    },
  ] : menuItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            <MonitorIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1a1a1a, #10b981)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              WebMonitor
            </Typography>
            <Typography variant="caption" color="text.secondary">
              网页监控系统
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List sx={{ p: 0 }}>
          {dynamicMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 2.5,
                    minHeight: 'auto',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                      borderLeft: '3px solid #10b981',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        transform: 'translateX(0)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#10b981',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#1a1a1a',
                        fontWeight: 600,
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(16, 185, 129, 0.8)',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? '#10b981' : 'rgba(0, 0, 0, 0.6)',
                      '& svg': {
                        fontSize: 20,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Info Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              mr: 2,
              background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
              fontSize: '0.9rem',
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, truncate: true }}>
              {user?.username || '用户'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ truncate: true }}>
              {user?.email || ''}
            </Typography>
          </Box>
          {isAdmin() && (
            <Chip
              size="small"
              label="管理员"
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                height: 20,
                alignSelf: 'flex-start',
                marginTop: 0,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          color: '#1a1a1a',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#10b981' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                }}
              >
                {dynamicMenuItems.find(item => item.path === location.pathname)?.icon || <DashboardIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                  {dynamicMenuItems.find(item => item.path === location.pathname)?.text || 'WebMonitor'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {dynamicMenuItems.find(item => item.path === location.pathname)?.description || ''}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Actions & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="通知">
              <IconButton
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
                }}
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="用户菜单">
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuClick}
                sx={{
                  p: 0.5,
                  '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-appbar"
              anchorEl={userMenuAnchor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <MenuItem
                onClick={handleUserMenuClose}
                sx={{ py: 2, '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' } }}
              >
                <AccountIcon sx={{ mr: 2, color: '#2563eb' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.username || '用户'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || ''}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => { handleUserMenuClose(); navigate('/user-management'); }}
                sx={{ display: isAdmin() ? 'flex' : 'none', py: 1.5, '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' } }}
              >
                <PeopleIcon sx={{ mr: 2, color: '#10b981' }} />
                用户管理
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'error.main' } }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                退出登录
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.06)',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
