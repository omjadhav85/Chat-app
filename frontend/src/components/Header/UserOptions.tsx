import React from "react";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";
import { useDataStore } from "@/store";
import { USER_DATA } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export const UserOptions = () => {
  const user = useDataStore((store) => store.user);
  const reset = useDataStore((store) => store.actions.reset);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA);
    reset();
    navigate("/");
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="plain" size="sm">
          <Avatar name={user?.name} src={user?.pic} />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="Profile" cursor="pointer">
          Profile
        </MenuItem>
        <MenuItem value="Logout" cursor="pointer" onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
