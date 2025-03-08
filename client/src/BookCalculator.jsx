import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button
} from "@mui/material";

export default function BookCalculator() {
  const [selectedSize, setSelectedSize] = useState("A4");
  const [paperRate, setPaperRate] = useState(100);
  const [quantity, setQuantity] = useState(1000);
  const [totalPages, setTotalPages] = useState("100");
  const [coverGSM, setCoverGSM] = useState("130");
  const [insideGSM, setInsideGSM] = useState("80");

  // finishing
  const [coverLaminationType, setCoverLaminationType] = useState("None");
  const [spotUVOption, setSpotUVOption] = useState("None");
  const [coatingOption, setCoatingOption] = useState("None");
  const [dripOffOption, setDripOffOption] = useState("None");

  // binding & ink
  const [bindingType, setBindingType] = useState("none");
  const [inkOption, setInkOption] = useState("Cover 4C / Inside 4C");

  const [result, setResult] = useState(null);

  async function handleCalculate() {
    try {
      const body = {
        calcType: "book",
        selectedSize,
        paperRate: Number(paperRate),
        quantity: Number(quantity),
        totalPages: Number(totalPages),
        coverGSM,
        insideGSM,
        coverLaminationType,
        spotUVOption,
        coatingOption,
        dripOffOption,
        bindingType,
        inkOption
      };

      const res = await fetch("http://localhost:5001/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Book calc error:", err);
      alert("Error calculating book");
    }
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader title="Book Calculator" />
      <CardContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "auto auto", gap: 2 }}>
          <Box>
            <InputLabel>Sheet Size</InputLabel>
            <Select
              size="small"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <MenuItem value="A3">A3</MenuItem>
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="A5">A5</MenuItem>
              <MenuItem value="A6">A6</MenuItem>
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
            <InputLabel>Quantity (Books)</InputLabel>
            <TextField
              size="small"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Box>

          <Box>
            <InputLabel>Total Pages</InputLabel>
            <TextField
              size="small"
              type="number"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
            />
          </Box>

          <Box>
            <InputLabel>Cover GSM</InputLabel>
            <Select
              size="small"
              value={coverGSM}
              onChange={(e) => setCoverGSM(e.target.value)}
            >
              <MenuItem value="130">130</MenuItem>
              <MenuItem value="170">170</MenuItem>
              <MenuItem value="210">210</MenuItem>
              <MenuItem value="250">250</MenuItem>
              <MenuItem value="300">300</MenuItem>
              <MenuItem value="350">350</MenuItem>
              <MenuItem value="400">400</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Inside GSM</InputLabel>
            <Select
              size="small"
              value={insideGSM}
              onChange={(e) => setInsideGSM(e.target.value)}
            >
              <MenuItem value="60">60</MenuItem>
              <MenuItem value="70">70</MenuItem>
              <MenuItem value="80">80</MenuItem>
              <MenuItem value="90">90</MenuItem>
              <MenuItem value="100">100</MenuItem>
              <MenuItem value="130">130</MenuItem>
              <MenuItem value="170">170</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Binding Type</InputLabel>
            <Select
              size="small"
              value={bindingType}
              onChange={(e) => setBindingType(e.target.value)}
            >
              <MenuItem value="none">No Binding</MenuItem>
              <MenuItem value="staple">Staple / Saddle Stitch</MenuItem>
              <MenuItem value="spiral">Spiral Binding</MenuItem>
              <MenuItem value="wiro">Wiro Binding</MenuItem>
              <MenuItem value="perfect">Perfect Binding</MenuItem>
              <MenuItem value="hardcover">Hardcover</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Ink Option</InputLabel>
            <Select
              size="small"
              value={inkOption}
              onChange={(e) => setInkOption(e.target.value)}
            >
              <MenuItem value="Cover 4C / Inside 4C">
                Cover Four Color / Inside Four Color
              </MenuItem>
              <MenuItem value="Cover 4C / Inside 1C">
                Cover Four Color / Inside Single Color
              </MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Cover Lamination</InputLabel>
            <Select
              size="small"
              value={coverLaminationType}
              onChange={(e) => setCoverLaminationType(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Gloss BOPP">Gloss BOPP</MenuItem>
              <MenuItem value="Matt BOPP">Matt BOPP</MenuItem>
              <MenuItem value="Gloss Thermal">Gloss Thermal</MenuItem>
              <MenuItem value="Matt Thermal">Matt Thermal</MenuItem>
              <MenuItem value="Velvet">Velvet</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Spot UV Option</InputLabel>
            <Select
              size="small"
              value={spotUVOption}
              onChange={(e) => setSpotUVOption(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Cover Only">Only On Cover Pages</MenuItem>
              <MenuItem value="All Pages">All Cover + Inside Pages</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>Coating Option</InputLabel>
            <Select
              size="small"
              value={coatingOption}
              onChange={(e) => setCoatingOption(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Cover Only">Only On Cover Pages</MenuItem>
              <MenuItem value="All Pages">All Cover + Inside Pages</MenuItem>
            </Select>
          </Box>

          <Box>
            <InputLabel>UV - DripOff</InputLabel>
            <Select
              size="small"
              value={dripOffOption}
              onChange={(e) => setDripOffOption(e.target.value)}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Only Cover">Only On Cover Pages</MenuItem>
              <MenuItem value="All Pages">All Cover + Inside Pages</MenuItem>
            </Select>
          </Box>
        </Box>

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCalculate}>
          Calculate
        </Button>

        {result && (
          <Box sx={{ mt: 2, borderTop: "1px solid #ccc", pt: 1 }}>
            <Typography variant="h6">Results:</Typography>
            <Typography>
              Cover Printing Cost: ₹{result.coverPrintingCost?.toFixed(2)}
            </Typography>
            <Typography>
              Inside Printing Cost: ₹{result.insidePrintingCost?.toFixed(2)}
            </Typography>
            <Typography>
              Total Printing Cost: ₹{result.printingCost?.toFixed(2)}
            </Typography>
            <Typography>Spot UV Cost: ₹{result.spotUVCost?.toFixed(2)}</Typography>
            <Typography>DripOff Cost: ₹{result.dripOffCost?.toFixed(2)}</Typography>
            <Typography>Coating Cost: ₹{result.coatingCost?.toFixed(2)}</Typography>
            <Typography>
              Cover Lamination Cost: ₹{result.coverLaminationCost?.toFixed(2)}
            </Typography>
            <Typography>Paper Cost: ₹{result.paperCost?.toFixed(2)}</Typography>
            <Typography>Binding Cost: ₹{result.bindingCost?.toFixed(2)}</Typography>
            <Typography>
              Total Before GST: ₹{result.totalCostBeforeGST?.toFixed(2)}
            </Typography>
            <Typography>GST (18%): ₹{result.gst?.toFixed(2)}</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Grand Total: ₹{result.totalCostWithGST?.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
