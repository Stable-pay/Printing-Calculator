import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminPanel() {
  const [config, setConfig] = useState(null);
  const [newPaperSize, setNewPaperSize] = useState("");
  const [newSpecialSize, setNewSpecialSize] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/config")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => {
        console.error("Error fetching config:", err);
        alert("Failed to fetch config");
      });
  }, []);

  async function handleSave() {
    try {
      const res = await fetch("http://localhost:5001/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      alert(data.message || "Config updated!");
    } catch (err) {
      console.error("Error saving config:", err);
      alert("Failed to save config");
    }
  }

  if (!config) return <div>Loading config...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Update printing rates and configurations
      </Typography>

      <Grid container spacing={3}>
        {/* Base Costs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Base Costs
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Base Fixed Cost"
                  type="number"
                  value={config.baseFixedCost}
                  onChange={(e) =>
                    setConfig({ ...config, baseFixedCost: Number(e.target.value) })
                  }
                />
                <TextField
                  label="Base Cost Per Extra"
                  type="number"
                  value={config.baseCostPerExtra}
                  onChange={(e) =>
                    setConfig({ ...config, baseCostPerExtra: Number(e.target.value) })
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lamination Rates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lamination Rates
              </Typography>
              {Object.entries(config.laminationRates).map(([type, rate]) => (
                <TextField
                  key={type}
                  label={type}
                  type="number"
                  value={rate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      laminationRates: {
                        ...config.laminationRates,
                        [type]: Number(e.target.value)
                      }
                    })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ))}

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Minimum Costs
              </Typography>
              {Object.entries(config.minimumLaminationCosts).map(([type, cost]) => (
                <TextField
                  key={type}
                  label={`${type} Minimum`}
                  type="number"
                  value={cost}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minimumLaminationCosts: {
                        ...config.minimumLaminationCosts,
                        [type]: Number(e.target.value)
                      }
                    })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Special Effects */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Special Effects
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Spot UV
              </Typography>
              <TextField
                label="Spot UV Rate"
                type="number"
                value={config.spotUVRateVal}
                onChange={(e) =>
                  setConfig({ ...config, spotUVRateVal: Number(e.target.value) })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Spot UV Fixed Per Plate"
                type="number"
                value={config.spotUVFixedPerPlate}
                onChange={(e) =>
                  setConfig({ ...config, spotUVFixedPerPlate: Number(e.target.value) })
                }
                fullWidth
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" gutterBottom>
                Drip Off
              </Typography>
              <TextField
                label="Drip Off Rate"
                type="number"
                value={config.dripOffRateVal}
                onChange={(e) =>
                  setConfig({ ...config, dripOffRateVal: Number(e.target.value) })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Drip Off Fixed Per Plate"
                type="number"
                value={config.dripOffFixedPerPlate}
                onChange={(e) =>
                  setConfig({ ...config, dripOffFixedPerPlate: Number(e.target.value) })
                }
                fullWidth
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" gutterBottom>
                Coating
              </Typography>
              <TextField
                label="Coating Rate"
                type="number"
                value={config.coatingRate}
                onChange={(e) =>
                  setConfig({ ...config, coatingRate: Number(e.target.value) })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Coating Minimum"
                type="number"
                value={config.coatingMinimum}
                onChange={(e) =>
                  setConfig({ ...config, coatingMinimum: Number(e.target.value) })
                }
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
        >
          Save All Changes
        </Button>
      </Box>
    </Box>
  );
}
