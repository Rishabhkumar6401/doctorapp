import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById } from '../store/doctor';
import { fetchSubcategoryDetail } from '../store/subcategories';
import { useLocation } from 'react-router-dom';
import { PDFDocument, rgb } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';
import { StandardFonts } from 'pdf-lib';

const PrintReport = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  const doctorDetails = useSelector((state) => state.doctors.doctorDetails);
  const subcategory = useSelector((state) => state.subcategory.subcategory);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderDetails || !orderDetails.referredBy || !orderDetails.subcategory) return;

    dispatch(fetchDoctorById(orderDetails.referredBy));
    dispatch(fetchSubcategoryDetail(orderDetails.subcategory));
  }, [dispatch, orderDetails]);

  const generatePdf = async () => {
    setLoading(true);
  
    try {
      // Fetch the existing PDF bytes
      const existingPdfBytes = await fetch('/letter.pdf').then((res) => res.arrayBuffer());
  
      // Load the PDF and get the first page
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Set custom page dimensions (A8 size)
      const [firstPage] = pdfDoc.getPages();
      firstPage.setSize(209, 144); // Width: 209 pts, Height: 144 pts
  
      const color = rgb(0, 0, 0);
      const boldColor = rgb(0, 0, 0.8);
      const marginTop = 40;
      const lineHeight = 6;
      const colSpacing = 90; // Adjusted spacing between columns
      const rightMargin = 5; // Margin from the right side
  
      const fontSizeText = 5;
      let yPosition = 144 - marginTop;
  
      const startX = 7;
  
      // Serial No in single row
      firstPage.drawText(`Serial No: ${orderDetails.serialNo}`, {
        x: startX,
        y: yPosition,
        size: fontSizeText ,
        color: boldColor,
        font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      });
  
      yPosition -= 2.5 * lineHeight;
  
      // Two fields per row layout (Patient details)
      const fields = [
        { label: 'Patient Name', value: orderDetails.name },
        { label: 'Patient Age', value: orderDetails.age },
        { label: 'Patient Address', value: orderDetails.address },
        { label: 'Patient Phone No', value: orderDetails.phoneNo },
        { label: 'Report Category', value: orderDetails.category },
        { label: 'Report SubCategory', value: subcategory.name },
        { label: 'Report Fee', value: orderDetails.fees },
        orderDetails.discount && { label: 'Discount', value: orderDetails.discount },
        { label: 'Final Payment', value: orderDetails.finalPayment },
        { label: 'Payment Mode', value: orderDetails.paymentMode },
      ].filter(Boolean);
  
      const maxWidth = colSpacing - 10; // Maximum width for wrapping
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      for (let i = 0; i < fields.length; i += 2) {
        const field1 = fields[i];
        const field2 = fields[i + 1];
  
        // Calculate height required for the first field
        const field1Text = `${field1.label}: ${field1.value}`;
        const field1Height = font.heightAtSize(fontSizeText) * Math.ceil(font.widthOfTextAtSize(field1Text, fontSizeText) / maxWidth);
  
        // Calculate height required for the second field
        const field2Text = field2 ? `${field2.label}: ${field2.value}` : '';
        const field2Height = field2
          ? font.heightAtSize(fontSizeText) * Math.ceil(font.widthOfTextAtSize(field2Text, fontSizeText) / maxWidth)
          : 0;
  
        // Determine row height (the tallest field in the row)
        const rowHeight = Math.max(field1Height, field2Height);
  
        // Draw first field (left column)
        firstPage.drawText(field1Text, {
          x: startX,
          y: yPosition,
          size: fontSizeText,
          color,
          font,
          maxWidth,
          lineHeight: lineHeight,
        });
  
        // Draw second field (right column)
        if (field2) {
          firstPage.drawText(field2Text, {
            x: startX + colSpacing,
            y: yPosition,
            size: fontSizeText,
            color,
            font,
            maxWidth: 209 - colSpacing - rightMargin,
            lineHeight: lineHeight,
          });
        }
  
        // Move to the next line, adjusted for the tallest field in the row
        yPosition -= rowHeight + lineHeight;
      }
  
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
  
      // Download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Order_Report.pdf';
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  
  
  

  if (!orderDetails || !subcategory) {
    return <div className="text-center text-xl mt-40">  <p className="text-red-600 text-lg font-medium">
    Some error occurred. Please fill the form again.
  </p>
  <button 
    onClick={() => navigate("/patients")} 
    className="px-6 py-2 bg-blue-500 text-white font-semibold text-xl rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
  >
    Back
  </button></div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-36">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Report Details</h1>
      <h6 className="text-md font-semibold text-center mb-8 text-gray-800"><strong className="text-gray-700">Serial No: </strong>{orderDetails.serialNo}</h6>

      {/* Order Details in Two Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p><strong className="text-gray-700">Patient Name:</strong> {orderDetails.name}</p>
          <p><strong className="text-gray-700">Patient Age:</strong> {orderDetails.age}</p>
          <p><strong className="text-gray-700">Patient Address:</strong> {orderDetails.address}</p>
          <p><strong className="text-gray-700">Patient Phone No:</strong> {orderDetails.phoneNo}</p>
          {doctorDetails && doctorDetails !== 0 && (
            <p><strong className="text-gray-700">Doctor Referred By:</strong> {doctorDetails.name}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p><strong className="text-gray-700">Report Category:</strong> {orderDetails.category}</p>
          <p><strong className="text-gray-700">Report SubCategory:</strong> {subcategory.name}</p>
          <p><strong className="text-gray-700">Report Fee:</strong> {orderDetails.fees}</p>
          {orderDetails.discount && <p><strong className="text-gray-700">Discount:</strong> {orderDetails.discount}</p>}
          <p><strong className="text-gray-700">Final Payment:</strong> {orderDetails.finalPayment}</p>
          <p><strong className="text-gray-700">Payment Mode:</strong> {orderDetails.paymentMode}</p>
        </div>
      </div>

      <button
        onClick={generatePdf}
        className="w-full mt-6 py-3 px-6 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition-all duration-300"
      >
        {loading ? 'Generating PDF...' : 'Generate PDF'}
      </button>
    </div>
  );
};

export default PrintReport;
