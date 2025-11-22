"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkIcon from "@mui/icons-material/Link";

type LinkData = {
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: string | null;
};

export default function Stats() {
  const { code } = useParams();
  const router = useRouter();
  const [data, setData] = useState<LinkData | null>(null);

  useEffect(() => {
    fetch(`/api/links/${code}`)
      .then((r) => r.json())
      .then(setData);
  }, [code]);

  if (!data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f3f4f6",
        }}
      >
        <Typography variant="body1">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6", py: 6 }}>
      <Stack maxWidth="sm" mx="auto" spacing={3}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/")}
          sx={{ width: "fit-content", borderRadius: "10px" }}
        >
          Back
        </Button>

        <Paper elevation={1} sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <LinkIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" color="text.secondary">
              Link stats
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight={600} mb={1}>
            {data.code}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
              <Chip label={data.totalClicks} color="primary" size="small" />
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Last Clicked
              </Typography>
              <Typography variant="body2">
                {data.lastClicked
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(data.lastClicked))
                  : "Never"}
              </Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Destination URL
              </Typography>
              <a
                href={data.targetUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "14px",
                  color: "#2563eb",
                  wordBreak: "break-all",
                  textDecoration: "underline",
                }}
              >
                {data.targetUrl}
              </a>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
