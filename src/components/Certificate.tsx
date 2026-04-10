import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormData } from '../types';
import { pledgeCategories } from '../data/pledges';
import { Download, Printer, Leaf, CheckCircle2, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface CertificateProps {
  formData: FormData;
  submissionId: string | null;
}

const categoryColors: Record<string, string> = {
  reduce_reuse_recycle: '#059669',
  conserve_energy: '#d97706',
  eat_sustainably: '#16a34a',
  eco_friendly_travel: '#0d9488',
  community_sustainability: '#65a30d',
};
const formatSignatureName = (name) => {
  if (!name) return "";

  return name
    .toLowerCase()
    .trim()
    .split(" ")
    .filter(word => word !== "")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Certificate({ formData, submissionId }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalPledges = Object.values(formData.pledges).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

 const handleDownloadPDF = async () => {
  if (!certRef.current) return;

  setDownloading(true);

  try {
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // ✅ Download PDF
    pdf.save(
      `sustainability-pledge-${formData.userDetails.name
        .replace(/\s+/g, '-')
        .toLowerCase()}.pdf`
    );

    // ✅ SEND EMAIL (ADDED)
    await emailjs.send(
      'service_w85nrkw',      // your service ID
      'template_4gkk7ek',     // 🔴 replace this
      {
        to_name: formData.userDetails.name,
        to_email: formData.userDetails.email,
        message:
          'Thank you for taking the sustainability pledge. Your commitment matters!',
      },
      'XqZilRDerxglV_kCR'       // 🔴 replace this
    );

    console.log("Email sent");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    setDownloading(false);
  }
};

  const handlePrint = async () => {
    if (!certRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fff',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <head>
            <title>Sustainability Pledge Certificate</title>
            <style>
              @page { size: landscape; margin: 0; }
              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
              img { width: 100%; max-width: 297mm; height: auto; }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Certificate is Ready!</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Thank you for pledging your commitment to a sustainable future
        </p>
        {submissionId && (
          <p className="text-xs text-gray-400 mt-1">
            Certificate ID: <span className="font-mono text-green-600">{submissionId}</span>
          </p>
        )}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <button
          onClick={handlePrint}
          disabled={printing}
          className="flex items-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
        >
          {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          {printing ? 'Preparing...' : 'Print Certificate'}
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div
          ref={certRef}
          className="relative bg-white"
          style={{
            width: 1050,
            minHeight: 680,
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 12,
              border: '3px double #16a34a',
              borderRadius: 4,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 20,
              border: '1px solid #86efac',
              borderRadius: 2,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 10,
              background: 'linear-gradient(90deg, #15803d, #4ade80, #15803d)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 10,
              background: 'linear-gradient(90deg, #15803d, #4ade80, #15803d)',
            }}
          />

          <div style={{ padding: '36px 48px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
               {/* Left Logos */}
  <div style={{ 
    display: 'flex', 
    gap: 12, 
    marginRight: 20,   // 👈 adds space from text
    flexShrink: 0      // 👈 prevents shrinking
  }}>
    <img src="/logo.webp" alt="Logo 1"
      style={{ width: 50, height: 50, objectFit: 'contain' }} />
  
  </div>
                <span style={{ fontSize: 13, color: '#15803d', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>
                  Greenovation Club Of Meghnad Saha Institute of Technology
                </span>
              <div style={{ 
    display: 'flex', 
    gap: 12, 
    marginLeft: 20,   // 👈 adds space from text
    flexShrink: 0
  }}>
    <img src="/glogo.png" alt="Logo 3"
      style={{ width: 50, height: 50, objectFit: 'contain' }} />
    
  </div>
              </div>

              <h1 style={{ fontSize: 38, fontWeight: 'bold', color: '#14532d', margin: '8px 0 4px', letterSpacing: 2, textTransform: 'uppercase' }}>
                Certificate of Pledge
              </h1>
              <div style={{ width: 120, height: 3, background: 'linear-gradient(90deg, transparent, #16a34a, transparent)', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Arial, sans-serif', marginBottom: 0 }}>
                This is to proudly certify that
              </p>
            </div>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 32, color: '#15803d', fontStyle: 'italic', margin: '0 0 4px', fontWeight: 'bold' }}>
                    {formData.userDetails.name}
                  </h2>
                  <p style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                    Location: {formData.userDetails.rollNo} &nbsp;|&nbsp; Organisation: {formData.userDetails.institution}
                  </p>
                  <div style={{ width: 200, height: 1, background: '#d1fae5', margin: '8px auto' }} />
                  <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Arial, sans-serif', lineHeight: 1.6, margin: 0 }}>
                    has solemnly pledged their commitment to a <strong style={{ color: '#15803d' }}>sustainable future</strong> by
                    taking <strong style={{ color: '#15803d' }}>{totalPledges} sustainability pledges</strong> across all five
                    key areas of environmental responsibility.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {pledgeCategories.map(cat => {
                    const items = formData.pledges[cat.id] || [];
                    if (!items.length) return null;
                    return (
                      <div
                        key={cat.id}
                        style={{
                          background: '#f9fafb',
                          border: `1px solid ${categoryColors[cat.id]}40`,
                          borderLeft: `3px solid ${categoryColors[cat.id]}`,
                          borderRadius: 6,
                          padding: '8px 10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                          <span style={{ fontSize: 14 }}>{cat.icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 'bold', color: categoryColors[cat.id], fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {cat.title}
                          </span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 12, listStyle: 'none' }}>
                          {items.map((item, i) => (
                            <li key={i} style={{ fontSize: 10, color: '#374151', fontFamily: 'Arial, sans-serif', marginBottom: 2, display: 'flex', gap: 4, alignItems: 'flex-start', lineHeight: 1.4 }}>
                              <span style={{ color: categoryColors[cat.id], flexShrink: 0, marginTop: 1 }}>✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ width: 140, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                {formData.photoUrl && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #16a34a',
                        margin: '0 auto 4px',
                        boxShadow: '0 4px 12px rgba(22,163,74,0.25)',
                      }}
                    >
                      <img
                        src={formData.photoUrl}
                        alt="Pledge holder"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p style={{ fontSize: 9, color: '#9ca3af', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                      Pledge Holder
                    </p>
                  </div>
                )}

                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    border: '3px solid #16a34a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(22,163,74,0.2)',
                  }}
                >
                  <Leaf style={{ width: 20, height: 20, color: '#15803d', marginBottom: 2 }} />
                  <span style={{ fontSize: 7, fontWeight: 'bold', color: '#15803d', fontFamily: 'Arial, sans-serif', textAlign: 'center', lineHeight: 1.2 }}>
                    SUSTAINABILITY
                    PLEDGE
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #d1fae5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: 10, color: '#6b7280', fontFamily: 'Arial, sans-serif', margin: '0 0 2px' }}>
                  Date of Pledge
                </p>
                <p style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                  {today}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: '#9ca3af', fontFamily: 'Arial, sans-serif', margin: 0, fontStyle: 'italic' }}>
                  "Together, we build a greener tomorrow"
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: '#6b7280', fontFamily: 'Arial, sans-serif', margin: '0 0 2px' }}>
                  Email
                </p>
                <p style={{ fontSize: 11, color: '#374151', fontFamily: 'Arial, sans-serif', margin: 0 }}>
                  {formData.userDetails.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}
