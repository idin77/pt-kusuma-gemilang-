import { FaqItem, CONTACT_INFO } from '../data/websiteData';

/**
 * Escapes a string to be safely embedded within a standard CSV cell (RFC 4180 compliant)
 */
function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) {
    return '""';
  }
  const stringValue = String(value);
  // If the cell contains quotes, commas, newlines, carriage returns, or semicolons, escape and wrap with double quotes
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Exports an array of FaqItem objects as a structured, UTF-8 encoded CSV file with BOM
 */
export function exportFaqsToCsv(
  faqs: FaqItem[], 
  options?: {
    activeCategory?: string;
    searchQuery?: string;
  }
) {
  if (!faqs || faqs.length === 0) {
    return;
  }

  const categoryName = options?.activeCategory && options.activeCategory !== 'Semua' 
    ? options.activeCategory 
    : 'Semua_Kategori';
  const cleanCategorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const now = new Date();
  const dateStamp = now.toISOString().split('T')[0];
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `FAQ_PT_Kusuma_Gemilang_Raya_${cleanCategorySlug}_${dateStamp}_${timeStamp}.csv`;

  // CSV Headers
  const headers = [
    'No',
    'ID Dokumen',
    'Kategori',
    'Pertanyaan (Question)',
    'Jawaban Resmi (Official Answer)',
    'Tipe Sorotan',
    'Status Verifikasi',
    'Perusahaan',
    'Kontak Hotline',
    'Standar Legalitas'
  ];

  const rows: string[][] = [];

  faqs.forEach((faq, index) => {
    const docId = `KGR-FAQ-${dateStamp.replace(/-/g, '')}-${String(index + 1).padStart(3, '0')}`;
    const badgeText = faq.badge === 'Verified' ? 'Terverifikasi Legal & SOP' : (faq.badge || 'Resmi Terverifikasi');
    
    rows.push([
      String(index + 1),
      docId,
      faq.category || 'Umum',
      faq.q,
      faq.a,
      faq.highlightType || 'Standar',
      badgeText,
      CONTACT_INFO.name,
      CONTACT_INFO.phoneDisplay,
      `${CONTACT_INFO.legal.nib} • IPLT Sumur Batu`
    ]);
  });

  // Construct CSV String
  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(','))
  ].join('\r\n');

  // Prepend UTF-8 BOM so Excel and spreadsheet viewers correctly render Indonesian text and symbols
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
