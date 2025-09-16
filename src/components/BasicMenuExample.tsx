import React, { useState, MouseEvent } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Box
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AccountCircle,
  Settings,
  Logout,
  Edit,
  Delete,
  Share
} from '@mui/icons-material';

// Type definitions
type MenuAction = 'Profile' | 'My account' | 'Settings' | 'Edit' | 'Share' | 'Delete' | 'Logout';

interface MenuState {
  anchorEl: HTMLElement | null;
  open: boolean;
}

const BasicMenuExample: React.FC = () => {
  // State for the first menu (simple)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  // State for the second menu (with icons)
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  const open2: boolean = Boolean(anchorEl2);

  // Handlers for first menu
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: MenuAction): void => {
    console.log(`Selected: ${action}`);
    handleClose();
  };

  // Handlers for second menu
  const handleClick2 = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = (): void => {
    setAnchorEl2(null);
  };

  const handleMenuItemClick2 = (action: MenuAction): void => {
    console.log(`Action: ${action}`);
    handleClose2();
  };

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h4" gutterBottom>
        Material-UI BasicMenu Examples
      </Typography>

      {/* Example 1: Simple Menu */}
      <Box>
        <Typography variant="h6" gutterBottom>
          1. Simple Menu
        </Typography>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="contained"
        >
          Open Menu
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick('Profile')}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('My account')}>
            My account
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Logout')}>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* Example 2: Menu with Icons */}
      <Box>
        <Typography variant="h6" gutterBottom>
          2. Menu with Icons and Dividers
        </Typography>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open2 ? 'long-menu' : undefined}
          aria-expanded={open2 ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick2}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleClose2}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick2('Profile')}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick2('Settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuItemClick2('Edit')}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick2('Share')}>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick2('Delete')}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuItemClick2('Logout')}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Open your browser's developer console to see the menu selections logged.
        </Typography>
      </Box>
    </Box>
  );
};

export default BasicMenuExample;