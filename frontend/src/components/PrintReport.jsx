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
  }, [dispatch, orderDetails]);
  const generatePdf = async () => {
    setLoading(true);
  
    try {
      // Fetch the existing PDF bytes
      const existingPdfBytes = await fetch('/newest.pdf').then((res) => res.arrayBuffer());
      if (!existingPdfBytes) {
        throw new Error('Failed to fetch the existing PDF.');
      }
  
      // Load the PDF and get the first page
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const [firstPage] = pdfDoc.getPages();
      firstPage.setSize(209, 144); // A8 size
  
      const color = rgb(0, 0, 0);
      const boldColor = rgb(0, 0, 0.8);
      const marginTop = 14; // Reduced margin for better fit
      const lineHeight = 5; // Smaller line height
      const additionalLineHeight = 2; // Extra space between wrapped lines
      const colSpacing = 100; // Increased spacing between columns
      const rightMargin = 5;
      const fontSizeText = 4; // Smaller text size
      let yPosition = 144 - marginTop;
  
      const startX = 7; // Starting position for the first column
      const secondColX = startX + colSpacing; // Starting position for the second column
  
      // Patient Details (Single Column)
      const fields = [
        { label: 'Serial No', value: orderDetails.serialNo },
        { label: 'Name', value: orderDetails.name },
        { label: 'Age', value: orderDetails.age },
        { label: 'Address', value: orderDetails.address },
        { label: 'Phone No', value: orderDetails.phoneNo },
        { label: 'Report Category', value: orderDetails.category },
        { label: 'Report SubCategory', value: orderDetails.subcategory },
        { label: 'Referred By', value: doctorDetails.name },
        { label: 'Report Fee', value: orderDetails.fees },
        orderDetails.discount > 0 && { label: 'Discount', value: orderDetails.discount },
        { label: 'Final Payment', value: orderDetails.finalPayment },
        { label: 'Payment Mode', value: orderDetails.paymentMode },
      ].filter(Boolean);
  
      const maxWidth = colSpacing - 10; // Adjust max width for both columns
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      // Function to wrap text manually
      const wrapText = (text, maxWidth, font, fontSize) => {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
        
        words.forEach((word) => {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const width = font.widthOfTextAtSize(testLine, fontSize);
          
          if (width <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
            }
            currentLine = word;
          }
        });
  
        if (currentLine) {
          lines.push(currentLine);
        }
  
        return lines;
      };
  
      // Function to draw fields in a column
      const drawDataInColumn = (startX, yPosition, fields) => {
        fields.forEach((field) => {
          const fieldText = `${field.label}: ${field.value}`;
          const fieldLines = wrapText(fieldText, maxWidth, font, fontSizeText);
  
          fieldLines.forEach((line, index) => {
            firstPage.drawText(line, {
              x: startX,
              y: yPosition - index * lineHeight,
              size: fontSizeText,
              color,
              font,
            });
          });
  
          yPosition -= fieldLines.length * lineHeight + 4; // Spacing between fields
        });
  
        return yPosition;
      };
  
      // Draw the patient information in the first column
      let leftColumnY = drawDataInColumn(startX, yPosition, fields);
  
      // Draw the doctor information in the second column (same content, opposite side)
      drawDataInColumn(secondColX, yPosition, fields); // Same fields but opposite column
  
      // Save the PDF and create a blob
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
  
      // Dynamic PDF filename
      const pdfFileName = `${orderDetails.name.replace(/\s+/g, '_')}_${orderDetails.serialNo}.pdf`;
  
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFileName; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Open PDF in a new tab
      const pdfWindow = window.open(url, '_blank');
      if (!pdfWindow) {
        throw new Error('Failed to open PDF in a new tab. Please allow popups for this site.');
      }
  
      // Delay print to ensure the PDF is fully loaded
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    } catch (error) {
      console.error('Error generating PDF:', error); // Logs the specific error
      alert(`An error occurred while generating the PDF: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  


  // const generatePdf = async () => {
  //   setLoading(true);
  
  //   try {
  //     const existingPdfBytes = await fetch('/newest.pdf').then((res) => res.arrayBuffer());
  //     if (!existingPdfBytes) {
  //       throw new Error('Failed to fetch the existing PDF.');
  //     }
  
  //     const pdfDoc = await PDFDocument.load(existingPdfBytes);
  //     const [firstPage] = pdfDoc.getPages();
  
  //     // Set the page size to A8 (2.9 x 4.1 inches in points)
  //     const pageWidth = 209.76; // A8 width in points
  //     const pageHeight = 295.2; // A8 height in points
  //     firstPage.setSize(pageWidth, pageHeight);
  
  //     const color = rgb(0, 0, 0);
  //     const fontSizeText = 5;
  //     const marginTop = 10;
  //     const lineHeight = 6;
  //     const columnSpacing = pageWidth / 2;
  //     const maxWidth = columnSpacing - 10;
  //     const startX = 5;
  //     const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  //     let yPosition = pageHeight - marginTop;
  
  //     // Wrap text function
  //     const wrapText = (text, maxWidth, font, fontSize) => {
  //       const words = text.split(' ');
  //       let lines = [];
  //       let currentLine = '';
  
  //       words.forEach((word) => {
  //         const testLine = currentLine ? currentLine + ' ' + word : word;
  //         const width = font.widthOfTextAtSize(testLine, fontSize);
  
  //         if (width <= maxWidth) {
  //           currentLine = testLine;
  //         } else {
  //           if (currentLine) {
  //             lines.push(currentLine);
  //           }
  //           currentLine = word;
  //         }
  //       });
  
  //       if (currentLine) {
  //         lines.push(currentLine);
  //       }
  
  //       return lines;
  //     };
  
  //     // Data fields
  //     const fields = [
  //       { label: 'Serial No', value: orderDetails.serialNo },
  //       { label: 'Name', value: orderDetails.name },
  //       { label: 'Age', value: orderDetails.age },
  //       { label: 'Address', value: orderDetails.address },
  //       { label: 'Phone No', value: orderDetails.phoneNo },
  //       { label: 'Report Category', value: orderDetails.category },
  //       { label: 'Report SubCategory', value: orderDetails.subcategory },
  //       { label: 'Referred By', value: doctorDetails.name },
  //       { label: 'Report Fee', value: orderDetails.fees },
  //       orderDetails.discount > 0 && { label: 'Discount', value: orderDetails.discount },
  //       { label: 'Final Payment', value: orderDetails.finalPayment },
  //       { label: 'Payment Mode', value: orderDetails.paymentMode },
  //     ].filter(Boolean);
  
  //     const drawDataInColumn = (startX, yPosition) => {
  //       fields.forEach((field) => {
  //         const fieldText = `${field.label}: ${field.value}`;
  //         const fieldLines = wrapText(fieldText, maxWidth, font, fontSizeText);
  
  //         fieldLines.forEach((line, index) => {
  //           firstPage.drawText(line, {
  //             x: startX,
  //             y: yPosition - index * lineHeight,
  //             size: fontSizeText,
  //             color,
  //             font,
  //           });
  //         });
  
  //         yPosition -= fieldLines.length * lineHeight + 4; // Spacing between fields
  //       });
  
  //       return yPosition;
  //     };
  
  //     // Draw first copy (left column)
  //     const leftColumnY = drawDataInColumn(startX, yPosition);
  
  //     // Draw second copy (right column)
  //     drawDataInColumn(startX + columnSpacing, yPosition);
  
  //     // Save the PDF and create a blob
  //     const pdfBytes = await pdfDoc.save();
  //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //     const url = URL.createObjectURL(blob);
  
  //     const pdfFileName = `${orderDetails.name.replace(/\s+/g, '_')}_${orderDetails.serialNo}.pdf`;
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = pdfFileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  
  //     // Open PDF in a new tab
  //     const pdfWindow = window.open(url, '_blank');
  //     if (!pdfWindow) {
  //       throw new Error('Failed to open PDF in a new tab. Please allow popups for this site.');
  //     }
  
  //     pdfWindow.onload = () => {
  //       pdfWindow.print();
  //     };
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     alert(`An error occurred while generating the PDF: ${error.message}. Please try again.`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  
  
  
  
  

  
  
  

  if (!orderDetails ) {
    return <div className="text-center text-xl mt-40">  <p className="text-red-600 text-lg font-medium">
    Some error occurred. Please fill the form again.
  </p>
  <button 
    onClick={() => navigate("/")} 
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
          <p><strong className="text-gray-700">Report SubCategory:</strong> {orderDetails.subcategory}</p>
          <p><strong className="text-gray-700">Report Fee:</strong> {orderDetails.fees}</p>
      {orderDetails.discount && orderDetails.discount > 0 && (
  <p>
    <strong className="text-gray-700">Discount:</strong> {orderDetails.discount}
  </p>
)}

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
