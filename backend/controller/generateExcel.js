const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const { fetchAllOrdersFromDB } = require("./order"); // Adjust path
const { fetchAllCategoriesFromDB } = require("./category"); // Adjust path

const generateExcelReport = async () => {
  try {
    const orders = await fetchAllOrdersFromDB();
    const categories = await fetchAllCategoriesFromDB();

    // Generate and save the Excel report
    const excelData = [];
    let serialNo = 1;

    orders.forEach((order) => {
      const category = categories.find((cat) => cat.name === order.subcategory.name);

      excelData.push({
        "Serial No": serialNo++,
        "Doctor Name": order.referredBy || "Unknown",
        "Doctor Mobile": order.referredByPhone || "N/A",
        "Doctor Address": order.referredByAddress || "N/A",
        Category: category?.name || "N/A",
        Subcategory: order.subcategory.name,
        Discount: order.discount || 0,
        "Final Payment": order.finalPayment || 0,
        "Referral Fee": order.referralFee || 0,
        "Total Commission": order.referralFee - order.discount || 0,
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");

    const filePath = "./Monthly_Report.xlsx";
    XLSX.writeFile(wb, filePath);

    console.log("Excel Report Generated:", filePath);

    // Send Email with Nodemailer
    await sendEmailWithAttachment(filePath);

    return filePath;
  } catch (error) {
    console.error("Error generating Excel report:", error);
    throw error;
  }
};

const sendEmailWithAttachment = async (filePath) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider
      auth: {
        user: "rishabh6401@gmail.com", // Replace with your email
        pass: "jumelvncoskjzssb", // Replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "rishabh6401@gmail.com", // Sender address
      to: "gozoomtechnologies@gmail.com", // Recipient email
      subject: "Monthly Excel Report",
      text: "Please find the attached Monthly Report.",
      attachments: [
        {
          filename: "Monthly_Report.xlsx",
          path: filePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  generateExcelReport,
};
