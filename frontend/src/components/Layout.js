import React from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  History as LogIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
  {
    text: '仪表板',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    text: '监控任务',
    icon: <TaskIcon />,
    path: '/tasks',
  },
  {
    text: '监控日志',
    icon: <LogIcon />,
    path: '/logs',
  },
  {
    text: '系统设置',
    icon: <SettingsIcon />,
    path: '/email-config',
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
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          WebMonitor
        </Typography>
      </Toolbar>
      <List>
        {dynamicMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuItemClick(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {dynamicMenuItems.find(item => item.path === location.pathname)?.text || 'WebMonitor'}
          </Typography>

          {/* 用户菜单 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="用户菜单">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuClick}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
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
            >
              <MenuItem onClick={handleUserMenuClose}>
                <AccountIcon sx={{ mr: 1 }} />
                {user?.username || '用户'}
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || ''}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleUserMenuClose(); navigate('/user-management'); }} sx={{ display: isAdmin() ? 'flex' : 'none' }}>
                <PeopleIcon sx={{ mr: 1 }} />
                用户管理
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
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
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
