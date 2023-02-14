import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadPdfDocument = (rootElementId, downloadFileName) => {
  const input = document.getElementById(rootElementId);
  html2canvas(input).then((canvas) => {
    console.log('input', input);
    console.log('canvas', canvas);
    const imgData = canvas.toDataURL('image/png');

 
    console.log('imgData', imgData);
    const pdf = new jsPDF('p', 'pt', 'a4', false);

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, false);
    pdf.save(`${downloadFileName}.pdf`);
  });
};
