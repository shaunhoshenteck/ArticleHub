import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@material-ui/core";
import DehazeIcon from "@material-ui/icons/Dehaze";
import HomeIcon from "@material-ui/icons/Home";
import MailIcon from "@material-ui/icons/Mail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NavSearch from "./search";

const SideDrawer = ({ users, signOutUser }) => {
  const [state, setState] = useState(false);

  return (
    <>
      <DehazeIcon
        className="drawer_btn"
        onClick={() => setState(true)}></DehazeIcon>
      <Drawer anchor={"right"} open={state} onClose={() => setState(false)}>
        <NavSearch closeDrawer={() => setState(false)}></NavSearch>
        <Divider></Divider>
        <List>
          <ListItem
            button
            component={RouterLink}
            to="/"
            onClick={() => setState(false)}>
            <ListItemIcon>
              <HomeIcon></HomeIcon>
            </ListItemIcon>
            <ListItemText primary="Home"></ListItemText>
          </ListItem>

          <ListItem
            button
            component={RouterLink}
            to="/contact"
            onClick={() => setState(false)}>
            <ListItemIcon>
              <MailIcon></MailIcon>
            </ListItemIcon>
            <ListItemText primary="Contact"></ListItemText>
          </ListItem>

          {!users.auth ? (
            <ListItem
              button
              component={RouterLink}
              to="/auth"
              onClick={() => setState(false)}>
              <ListItemIcon>
                <VpnKeyIcon></VpnKeyIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In"></ListItemText>
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={() => {
                signOutUser();
                setState(false);
              }}>
              <ListItemIcon>
                <VpnKeyIcon></VpnKeyIcon>
              </ListItemIcon>
              <ListItemText primary="Sign Out"></ListItemText>
            </ListItem>
          )}

          {users.auth ? (
            <>
              <Divider></Divider>
              <List>
                <ListItem
                  button
                  component={RouterLink}
                  to="/dashboard"
                  onClick={() => setState(false)}>
                  <ListItemIcon>
                    <DashboardIcon></DashboardIcon>
                  </ListItemIcon>
                  <ListItemText primary="Dashboard"></ListItemText>
                </ListItem>
              </List>
            </>
          ) : null}
        </List>
      </Drawer>
    </>
  );
};

export default SideDrawer;
