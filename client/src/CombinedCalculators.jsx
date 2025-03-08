import React, { useState } from "react";
import { Box, InputLabel, Select, MenuItem } from "@mui/material";
import FlyerCalculator from "./FlyerCalculator";
import BookCalculator from "./BookCalculator";
import BrochureCalculator from "./BrochureCalculator";

export default function CombinedCalculators() {
  const [calcType, setCalcType] = useState("flyer");

  return (
    <Box sx={{ p: 2 }}>
      <h1>Printing Calculator</h1>

      <Box sx={{ mb: 2, width: 250 }}>
        <InputLabel>Calculator Type</InputLabel>
        <Select
          size="small"
          value={calcType}
          onChange={(e) => setCalcType(e.target.value)}
          fullWidth
        >
          <MenuItem value="flyer">Flyer / Leaflet</MenuItem>
          <MenuItem value="book">Book</MenuItem>
          <MenuItem value="brochure">Brochure</MenuItem>
        </Select>
      </Box>

      {calcType === "flyer" && <FlyerCalculator />}
      {calcType === "book" && <BookCalculator />}
      {calcType === "brochure" && <BrochureCalculator />}
    </Box>
  );
}
