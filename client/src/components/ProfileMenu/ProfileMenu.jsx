import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Menu>
      <Menu.Target>
        <Avatar 
          src={user?.image || ""} 
          alt="user image" 
          radius={"xl"}
          style={{ cursor: "pointer" }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item disabled>{user?.name || user?.email}</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => navigate("/favourites")}>
          Favourites
        </Menu.Item>
        {user?.isAdmin && (
          <Menu.Item onClick={() => navigate("/admin")}>
            Admin Dashboard
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item
          onClick={handleLogout}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;

