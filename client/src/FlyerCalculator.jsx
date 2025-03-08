import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Typography
} from "@mui/material";

export default function FlyerCalculator() {
  const [selectedSize, setSelectedSize] = useState("A4");
  const [gsm, setGsm] = useState(130);
  const [paperRate, setPaperRate] = useState(100);
  const [totalSheets, setTotalSheets] = useState(1000);
  const [isDoubleSided, setIsDoubleSided] = useState(false);
  const [isLamination, setIsLamination] = useState(false);
  const [laminationType, setLaminationType] = useState("Gloss BOPP");
  const [laminationSide, setLaminationSide] = useState("single");
  const [spotUV, setSpotUV] = useState(false);
  const [spotUVSide, setSpotUVSide] = useState("single");

  const [result, setResult] = useState(null);

  async function handleCalculate() {
    try {
      const body = {
        calcType: "flyer",
        selectedSize,
        gsm: Number(gsm),
        paperRate: Number(paperRate),
        totalSheets: Number(totalSheets),
        isDoubleSided,
        isLamination,
        laminationType,
        laminationSide,
        spotUV,
        spotUVSide
      };

      const res = await fetch("http://localhost:5001/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Flyer calculation error:", err);
      alert("Error calculating flyer");
    }
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader title="Flyer / Leaflet Calculator" />
      <CardContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "auto auto", gap: 2 }}>
          <Box>
            <InputLabel>Sheet Size</InputLabel>
            <Select
              size="small"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <MenuItem value="A2">A2</MenuItem>
              <MenuItem value="A3">A3</MenuItem>
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="A5">A5</MenuItem>
              <MenuItem value="A6">A6</MenuItem>
              <MenuItem value="17x22">17x22</MenuItem>
              <MenuItem value="11x17">11x17</MenuItem>
              <MenuItem value="11x8.5">11x8.5</MenuItem>
              <MenuItem value="5.5x8.5">5.5x8.5</MenuItem>
              <MenuItem value="5.5x4.23">5.5x4.23</MenuItem>
              <MenuItem value="19.5x28">19.5x28</MenuItem>
              <MenuItem value="14x19.5">14x19.5</MenuItem>
              <MenuItem value="14x9.75">14x9.75</MenuItem>
              <MenuItem value="9.75x7">9.75x7</MenuItem>
              <MenuItem value="7x4.80">7x4.80</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Paper Rate (₹/KG)</InputLabel>
            <TextField
              size="small"
              type="number"
              value={paperRate}
              onChange={(e) => setPaperRate(e.target.value)}
            />
          </Box>

          <Box>
            <InputLabel>GSM</InputLabel>
            <TextField
              size="small"
              type="number"
              value={gsm}
              onChange={(e) => setGsm(e.target.value)}
            />
          </Box>

          <Box>
            <InputLabel>Total Sheets</InputLabel>
            <TextField
              size="small"
              type="number"
              value={totalSheets}
              onChange={(e) => setTotalSheets(e.target.value)}
            />
          </Box>

          <Box>
            <FormControlLabel
              label="Double-Sided?"
              control={
                <Checkbox
                  checked={isDoubleSided}
                  onChange={() => setIsDoubleSided(!isDoubleSided)}
                />
              }
            />
          </Box>

          <Box>
            <FormControlLabel
              label="Lamination?"
              control={
                <Checkbox
                  checked={isLamination}
                  onChange={() => setIsLamination(!isLamination)}
                />
              }
            />
            {isLamination && (
              <>
                <InputLabel>Lamination Type</InputLabel>
                <Select
                  size="small"
                  value={laminationType}
                  onChange={(e) => setLaminationType(e.target.value)}
                >
                  <MenuItem value="Gloss BOPP">Gloss BOPP</MenuItem>
                  <MenuItem value="Matt BOPP">Matt BOPP</MenuItem>
                  <MenuItem value="Gloss Thermal">Gloss Thermal</MenuItem>
                  <MenuItem value="Matt Thermal">Matt Thermal</MenuItem>
                  <MenuItem value="Velvet">Velvet</MenuItem>
                </Select>

                <InputLabel>Lamination Side</InputLabel>
                <Select
                  size="small"
                  value={laminationSide}
                  onChange={(e) => setLaminationSide(e.target.value)}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                </Select>
              </>
            )}
          </Box>

          <Box>
            <FormControlLabel
              label="Spot UV?"
              control={<Checkbox checked={spotUV} onChange={() => setSpotUV(!spotUV)} />}
            />
            {spotUV && (
              <>
                <InputLabel>Spot UV Side</InputLabel>
                <Select
                  size="small"
                  value={spotUVSide}
                  onChange={(e) => setSpotUVSide(e.target.value)}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                </Select>
              </>
            )}
          </Box>
        </Box>

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCalculate}>
          Calculate
        </Button>

        {result && (
          <Box sx={{ mt: 2, borderTop: "1px solid #ccc", pt: 1 }}>
            <Typography variant="h6">Results:</Typography>
            <Typography>Effective Sheets: {result.effectiveSheets}</Typography>
            <Typography>Printing Sheets: {result.printingSheets}</Typography>
            <Typography>Paper Cost: ₹{result.paperCost?.toFixed(2)}</Typography>
            <Typography>Printing Cost: ₹{result.printingCost?.toFixed(2)}</Typography>
            <Typography>Lamination Cost: ₹{result.laminationCost?.toFixed(2)}</Typography>
            <Typography>Spot UV Cost: ₹{result.spotUVCost?.toFixed(2)}</Typography>
            <Typography>
              Total Cost Before GST: ₹{result.totalCostBeforeGST?.toFixed(2)}
            </Typography>
            <Typography>GST (18%): ₹{result.gst?.toFixed(2)}</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Total (with GST): ₹{result.totalCostWithGST?.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
