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
        <div className="poster-title-block">
          <div className="poster-title-line">
            <span className="poster-year">{vehicle.year}</span>
            <span className="poster-make">{vehicle.makeName}</span>
          </div>
          <div className="poster-model-large">{vehicle.model}</div>
        </div>
        <div className="poster-price-center">
          {vehicle.value ? `$${Number(String(vehicle.value).replace(/[^0-9]/g, '')).toLocaleString()}` : '—'}
        </div>
        <div className="poster-specs-wide">
          <div className="spec"><label>Trim</label><span>{vehicle.trim || '—'}</span></div>
          <div className="spec"><label>Sub-Model</label><span>{vehicle['sub-model'] || '—'}</span></div>
          <div className="spec"><label>Mileage</label><span>{vehicle.mileage ? `${Number(String(vehicle.mileage).replace(/[^0-9]/g, '')).toLocaleString()} km` : '—'}</span></div>
          <div className="spec"><label>Engine</label><span>{vehicle.engine || '—'}</span></div>
          <div className="spec"><label>Stock #</label><span>{vehicle.stock_number || '—'}</span></div>
        </div>
        <div className="poster-footer">Red Deer Toyota · Used Inventory · reddeertoyota.com</div>
      </div>
      <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
    </div>
  );
};

export default Poster;
