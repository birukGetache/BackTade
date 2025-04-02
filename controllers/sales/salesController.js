const totalSale = require('../../model/SchemaTotalSale')
const Transaction = require('../../model/Transaction')
module.exports.totalSaleFunction =  async (req, res) => {
    try {
      // Fetch all total sales data
      const result = await totalSale.find();
      res.status(200).json(result); // Send the result as a JSON response
    } catch (error) {
      console.log("Error fetching total sales:", error);
      res.status(500).json({ error: "Failed to fetch total sales." });
    }
  }

  module.exports.HighSold = async (req, res) => {
    try {
      // Find the medicine with the highest soldQuantity
      const Transactions = await Transaction.findOne().sort({ soldQuantity: -1 }).exec();
      
      if (!Transactions) {
        return res.status(404).json({ message: 'No medicine found' });
      }
  
      res.json(Transactions);
    } catch (error) {
      console.error('Error fetching the medicine:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  module.exports.TotalSell = async (req, res) => {
    console.log("Request received for TotalSell");
    try {
      const result = await totalSale.find();
      console.log("Fetched result:", result);
  
      // Explicitly setting content type
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching total sales:", error);
      res.status(500).json({ error: "Failed to fetch total sales." });
    }
  };
  
  module.exports.Sales =  async (req, res) => {
    try {
      const salesData = await Transaction.find({}); // Fetch all transactions
  
      // Get today's date
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1); // Next day
  
      // Format the data to group by saler
      const groupedSales = salesData.reduce((acc, sale) => {
        if (!acc[sale.saler]) {
          acc[sale.saler] = { 
            pharmacist: sale.saler, 
            pharmacy: sale.pharmacy, // Add pharmacy name
            totalSales: 0, // Total sales
            todaySales: 0, // Today's sales
            latestSoldQuantity: 0, 
            salesDate: null 
          };
        }
  
        // Sum total sales for the pharmacist
        acc[sale.saler].totalSales += sale.soldQuantity;
  
        // Check if the sale is from today
        const saleDate = new Date(sale.date);
        if (saleDate >= startOfDay && saleDate < endOfDay) {
          acc[sale.saler].todaySales += sale.soldQuantity; // Summing up today's sold quantities
          acc[sale.saler].salesDate = sale.date; // Update to the most recent sale date
          acc[sale.saler].latestSoldQuantity = sale.soldQuantity; // Update latest sold quantity
        }
  
        return acc;
      }, {});
  
      res.json(Object.values(groupedSales));
    } catch (error) {
      res.status(500).json({ error: 'Error fetching sales data' });
    }
  }