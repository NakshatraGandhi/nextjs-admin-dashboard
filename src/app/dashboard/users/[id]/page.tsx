"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Grid,
  CircularProgress, Button, Divider, Paper,
} from "@mui/material";
import { ArrowBack, Email, Phone, Business, LocationOn, Person } from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";
import { User } from "@/store";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <Box>
      <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                src={user.image}
                alt={user.firstName}
                sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "4px solid", borderColor: "primary.main" }}
              />
              <Typography variant="h5" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{user.username}
              </Typography>
              <Chip
                label={user.gender}
                color={user.gender === "male" ? "info" : "secondary"}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Age: {user.age}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {[
                { icon: <Email color="primary" />, label: "Email", value: user.email },
                { icon: <Phone color="primary" />, label: "Phone", value: user.phone },
              ].map((row) => (
                <Box key={row.label} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  {row.icon}
                  <Box>
                    <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                    <Typography variant="body1">{row.value}</Typography>
                  </Box>
                </Box>
              ))}

              <Typography variant="h6" fontWeight={700} sx={{ mt: 3, mb: 2 }}>
                Company
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Business color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Company</Typography>
                  <Typography variant="body1">{user.company?.name}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Person color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Title / Department</Typography>
                  <Typography variant="body1">
                    {user.company?.title} — {user.company?.department}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" fontWeight={700} sx={{ mt: 3, mb: 2 }}>
                Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOn color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">
                    {user.address?.city}, {user.address?.state}, {user.address?.country}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
