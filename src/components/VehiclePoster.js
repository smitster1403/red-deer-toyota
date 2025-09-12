import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// A4 portrait 210mm x 297mm -> convert to px at 96 DPI ~ 794 x 1123, we use higher scale for clarity
const Poster = ({ vehicle }) => {
  const ref = useRef(null);

  const handleDownloadPdf = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Fit image width to page while preserving aspect ratio
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = Math.max(0, (pageHeight - imgHeight) / 2);
    pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
    const name = `${vehicle.makeName || 'Vehicle'}-${vehicle.year || ''}-${vehicle.model || ''}`
      .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/gi, '')
      .toLowerCase();
    pdf.save(`${name || 'poster'}.pdf`);
  };

  return (
    <div className="poster-wrapper">
      <div className="poster" ref={ref}>
        <div className="poster-header">
          <div className="poster-title">
            <span className="poster-year">{vehicle.year}</span>
            <span className="poster-make">{vehicle.makeName}</span>
            <span className="poster-model">{vehicle.model}</span>
          </div>
          <div className="poster-price">{vehicle.value ? `$${Number(String(vehicle.value).replace(/[^0-9]/g, '')).toLocaleString()}` : '—'}</div>
        </div>
        <div className="poster-body">
          <div className="poster-specs">
            <div><strong>Trim</strong><div>{vehicle.trim || '—'}</div></div>
            <div><strong>Sub-Model</strong><div>{vehicle['sub-model'] || '—'}</div></div>
            <div><strong>Mileage</strong><div>{vehicle.mileage ? `${Number(String(vehicle.mileage).replace(/[^0-9]/g, '')).toLocaleString()} km` : '—'}</div></div>
            <div><strong>Engine</strong><div>{vehicle.engine || '—'}</div></div>
            <div><strong>Stock #</strong><div>{vehicle.stock_number || '—'}</div></div>
          </div>
          <div className="poster-footer">Red Deer Toyota · Used Inventory · reddeertoyota.com</div>
        </div>
      </div>
      <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
    </div>
  );
};

export default Poster;
