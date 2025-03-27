import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

const SlideBarMenu = ({ items }) => {
  const [openItems, setOpenItems] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  // Handle menu toggle for items with sub-items
  const handleClick = (index) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Function to render menu items recursively
  const renderMenuItems = (items, parentIndex = "", isSubItem = false) => {
    return items.map((item, index) => {
      const currentIndex = `${parentIndex}${index}`;
      const isActive = location.pathname === item.path;

      return (
        <div key={currentIndex}>
          <ListItem
            button
            onClick={() => (item.subItems ? handleClick(currentIndex) : null)}
            component={Link}
            to={item.path}
            state={item.state} // Truyền state để xác định isHistory
            sx={{
              pl: isSubItem ? 4 : 2,
              backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "inherit",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 25 }}>
                <FontAwesomeIcon icon={item.icon} />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
            {item.subItems &&
              (openItems[currentIndex] ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>

          {item.subItems && (
            <Collapse
              in={openItems[currentIndex]}
              timeout="auto"
              unmountOnExit
              id={`submenu-${currentIndex}`}
            >
              <List component="div" disablePadding>
                {renderMenuItems(item.subItems, `${currentIndex}-`, true)}
              </List>
            </Collapse>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 200,
            top: "65px",
            height: "calc(100% - 65px)",
          },
        }}
        open
      >
        <List>{renderMenuItems(items)}</List>
      </Drawer>
      <Drawer
        anchor="left"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 200 },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <List>{renderMenuItems(items)}</List>
      </Drawer>
    </>
  );
};

export default SlideBarMenu;
