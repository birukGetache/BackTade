const totalSale = require('../../model/SchemaTotalSale')
module.exports.TotalSaleToday =   async (req, res) => {
    try {
      const salesValue = Number(req.params.totalSales);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to the start of the day
  
      console.log("Received sales:", salesValue);
  
      // Check if sales for today already exist
      let existingSale = await totalSale.findOne({
        sentDate: { 
          $gte: today, 
          $lt: new Date(today.getTime() + 86400000) // End of today
        }
      });
  
      if (existingSale) {
        // Update the existing sales record
        existingSale.totleSale += salesValue;
        await existingSale.save();
        res.status(200).json({ message: 'Sales updated successfully', totalSales: existingSale.totleSale });
      } else {
        // Create a new sales record for today
        const newSale = new totalSale({ totleSale: salesValue });
        await newSale.save();
        res.status(201).json({ message: 'Sales saved successfully', totalSales: newSale.totleSale });
      }
    } catch (error) {
      console.error("Error saving sales:", error);
      res.status(500).json({ error: 'An error occurred while saving sales' });
    }
  }