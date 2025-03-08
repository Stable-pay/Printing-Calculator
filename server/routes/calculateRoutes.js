const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sheetSize, paperRate, gsm, totalSheets, doubleSided, lamination, laminationType, spotUV, spotUVSide, coatingOption } = req.body;

    // Deduct one credit for the calculation
    const user = req.user;
    const creditDeducted = user.deductCredit();
    
    if (!creditDeducted) {
      return res.status(403).json({
        message: 'No credits available',
        creditsRequired: true
      });
    }

    // Save the updated user with deducted credit
    await user.save();

    // Calculate paper cost
    const paperCost = (paperRate * gsm * totalSheets) / 3.22;

    // Calculate printing cost
    let printingCost = doubleSided ? paperCost * 2 : paperCost;

    // Calculate lamination cost if applicable
    let laminationCost = 0;
    if (lamination && laminationType) {
      const laminationRate = req.app.locals.config.laminationRates[laminationType];
      const minimumCost = req.app.locals.config.minimumLaminationCosts[laminationType.split(" ")[0]];
      
      laminationCost = Math.max(
        totalSheets * laminationRate * (doubleSided ? 2 : 1),
        minimumCost
      );
    }

    // Calculate Spot UV cost if applicable
    let spotUVCost = 0;
    if (spotUV) {
      const spotUVRate = req.app.locals.config.spotUVRateVal;
      const spotUVFixedCost = req.app.locals.config.spotUVFixedPerPlate;
      
      spotUVCost = (totalSheets * spotUVRate) + 
        (spotUVSide === "double" ? spotUVFixedCost * 2 : spotUVFixedCost);
    }

    // Calculate coating cost if applicable
    let coatingCost = 0;
    if (coatingOption && coatingOption !== "None") {
      const coatingRate = req.app.locals.config.coatingRate;
      const coatingMinimum = req.app.locals.config.coatingMinimum;
      
      const calculatedCost = totalSheets * coatingRate * 
        (coatingOption === "Both Sides" ? 2 : 1);
      
      coatingCost = Math.max(calculatedCost, coatingMinimum);
    }

    // Calculate total cost
    const totalCost = printingCost + laminationCost + spotUVCost + coatingCost;

    res.json({
      paperCost,
      printingCost,
      laminationCost,
      spotUVCost,
      coatingCost,
      totalCost,
      creditsRemaining: user.subscription.credits
    });
  } catch (error) {
    console.error("Calculation error:", error);
    res.status(500).json({ message: "Error performing calculation" });
  }
});

module.exports = router;
