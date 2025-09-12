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
    // Fit image to full page width; with A4-matching aspect ratio this fills the page height
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    const name = `${vehicle.makeName || 'Vehicle'}-${vehicle.year || ''}-${vehicle.model || ''}`
      .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/gi, '')
      .toLowerCase();
    pdf.save(`${name || 'poster'}.pdf`);
  };

  return (
    <div className="poster-wrapper">
      <div className="poster" ref={ref}>
        {/* Header with logo and brand */}
        <div className="poster-header-brand">
          <div className="brand-left">
            <img
              className="brand-logo"
              src={`${process.env.PUBLIC_URL || ''}/red-deer-logo.png`}
              alt="Red Deer Toyota logo"
            />
            {/* <div className="brand-info">
              <div className="brand-name">Red Deer Toyota</div>
              <div className="brand-site">reddeertoyota.com</div>
            </div> */}
          </div>
          <div className="brand-right">
            <div className="stock-label">Stock #</div>
            <div className="stock-value">{vehicle.stock_number || '—'}</div>
          </div>
        </div>

        {/* Center price banner */}
        <div className="poster-price-banner">
          {vehicle.value ? `$${Number(String(vehicle.value).replace(/[^0-9]/g, '')).toLocaleString()}` : '—'}
        </div>

        {/* Vehicle title */}
        <div className="poster-title-block">
          <div className="poster-title-line">
            <span className="poster-year">{vehicle.year}</span>
            <span className="poster-make">{vehicle.makeName}</span>
          </div>
          <div className="poster-model-large">{vehicle.model}</div>
          {(vehicle.trim || vehicle['sub-model']) && (
            <div className="poster-subtitle">
              {[vehicle.trim, vehicle['sub-model']].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>

        {/* Specs grid */}
        <div className="poster-specs-wide">
          <div className="spec"><label>Mileage</label><span>{vehicle.mileage ? `${Number(String(vehicle.mileage).replace(/[^0-9]/g, '')).toLocaleString()} km` : '—'}</span></div>
          <div className="spec"><label>Engine</label><span>{vehicle.engine || '—'}</span></div>
          <div className="spec"><label>Trim</label><span>{vehicle.trim || '—'}</span></div>
          <div className="spec"><label>Sub-Model</label><span>{vehicle['sub-model'] || '—'}</span></div>
          <div className="spec"><label>Make</label><span>{vehicle.makeName || '—'}</span></div>
          <div className="spec"><label>Model</label><span>{vehicle.model || '—'}</span></div>
        </div>

        <div className="poster-footer">Red Deer Toyota · Used Inventory · reddeertoyota.com</div>
      </div>
      <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
    </div>
  );
};

export default Poster;
