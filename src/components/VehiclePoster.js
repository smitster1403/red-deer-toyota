import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// A4 portrait 210mm x 297mm -> convert to px at 96 DPI ~ 794 x 1123, we use higher scale for clarity
const Poster = ({ vehicle }) => {
  const ref = useRef(null);
  const [templateAvailable, setTemplateAvailable] = useState(false);

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

  const contentClassic = (
    <>
      {/* Logo centered */}
      <div className="poster-logo-center">
        <img
          className="brand-logo-lg"
          src={`${process.env.PUBLIC_URL || ''}/red-deer-logo.png`}
          alt="Red Deer Toyota logo"
        />
      </div>

  {/* Model name centered and bold, with year */}
  <div className="poster-model-center">{`${vehicle.year ? vehicle.year + ' ' : ''}${vehicle.makeName || ''} ${vehicle.model || ''}`}</div>

      {/* Vehicle information block */}
      <div className="poster-info-box">
        <div className="info-line"><span className="info-label">Trim:</span> <span className="info-value">{vehicle.trim || '—'}</span></div>
        <div className="info-line"><span className="info-label">Condition:</span> <span className="info-value">Used</span></div>
        <div className="info-line"><span className="info-label">Stock #:</span> <span className="info-value">{vehicle.stock_number || '—'}</span></div>
        <div className="info-line"><span className="info-label">Odometer:</span> <span className="info-value">{vehicle.mileage ? `${Number(String(vehicle.mileage).replace(/[^0-9]/g, '')).toLocaleString()} km` : '—'}</span></div>
        <div className="info-line"><span className="info-label">Engine:</span> <span className="info-value">{vehicle.engine || '—'}</span></div>
      </div>

      {/* Price line */}
      <div className="poster-price-line">
        <span className="price-label">Price:</span>
        <span className="price-value">{vehicle.value ? `$${Number(String(vehicle.value).replace(/[^0-9]/g, '')).toLocaleString()}` : '—'}</span>
      </div>

      {/* Disclaimer */}
      <div className="poster-disclaimer">Price Does not include taxes and licensing fees.</div>
    </>
  );

  const contentTemplate = (
    <>
      {/* Background template image */}
      <img
        className="poster-template-img"
        src={`${process.env.PUBLIC_URL || ''}/templates/T63471.png`}
        alt="Template"
        onLoad={() => setTemplateAvailable(true)}
        onError={() => setTemplateAvailable(false)}
      />
      <div className="poster-overlay">
        <div className="fld fld-logo">
          <img className="brand-logo" src={`${process.env.PUBLIC_URL || ''}/red-deer-logo.png`} alt="Logo" />
        </div>
        <div className="fld fld-stock">{vehicle.stock_number || ''}</div>
        <div className="fld fld-price">{vehicle.value ? `$${Number(String(vehicle.value).replace(/[^0-9]/g, '')).toLocaleString()}` : ''}</div>
  <div className="fld fld-year-make">{vehicle.makeName || ''}</div>
  <div className="fld fld-model">{`${vehicle.year ? vehicle.year + ' ' : ''}${vehicle.model || ''}`}</div>
        <div className="fld fld-trim-sub">{[vehicle.trim, vehicle['sub-model']].filter(Boolean).join(' · ')}</div>
        <div className="fld fld-mileage">{vehicle.mileage ? `${Number(String(vehicle.mileage).replace(/[^0-9]/g, '')).toLocaleString()} km` : ''}</div>
        <div className="fld fld-engine">{vehicle.engine || ''}</div>
      </div>
    </>
  );

  return (
    <div className="poster-wrapper">
      <div className={`poster${templateAvailable ? ' template' : ''}`} ref={ref}>
        {/* Try to render template; fallback to classic when not available */}
        {templateAvailable ? contentTemplate : (
          <>
            {/* Preload template and set availability */}
            <img
              className="poster-template-preload"
              src={`${process.env.PUBLIC_URL || ''}/templates/T63471.png`}
              alt="Template preload"
              onLoad={() => setTemplateAvailable(true)}
              onError={() => setTemplateAvailable(false)}
              style={{ display: 'none' }}
            />
            {contentClassic}
          </>
        )}
      </div>
      <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
    </div>
  );
};

export default Poster;
