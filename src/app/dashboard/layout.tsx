"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar,
  Divider, CircularProgress, Tooltip, useMediaQuery, useTheme,
} from "@mui/material";
import {
  People, Inventory, Menu, ChevronLeft, Logout, Dashboard,
} from "@mui/icons-material";
import Link from "next/link";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Users", href: "/dashboard/users", icon: <People /> },
  { label: "Products", href: "/dashboard/products", icon: <Inventory /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, background: "linear-gradient(90deg,#1a237e,#1565c0)" }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)} sx={{ mr: 2 }}>
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
          <Dashboard sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} sx={{ width: 34, height: 34 }} />
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {session?.user?.name}
            </Typography>
            <Tooltip title="Sign out">
              <IconButton color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", background: "#1a237e", color: "#fff" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 1 }}>
          <List>
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={() => isMobile && setOpen(false)}
                    sx={{
                      mx: 1, borderRadius: 2, mb: 0.5,
                      bgcolor: active ? "rgba(255,255,255,0.2)" : "transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 400 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: !isMobile && open ? `${DRAWER_WIDTH}px` : 0,
          transition: "margin 0.2s",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
