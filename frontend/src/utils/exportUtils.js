import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const EXPORT_COLUMNS = ['#', 'Name', 'Contact No', 'ATS Score']

function buildRows(candidates) {
  return candidates.map((c, i) => [i + 1, c.candidate_name || '—', c.phone || '—', c.score ?? '—'])
}

export function exportToPDF(candidates, filename = 'ats-results') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('ATS Candidate Report', 14, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120)
  doc.text(`Generated: ${new Date().toLocaleString()}  |  Total: ${candidates.length} candidate${candidates.length !== 1 ? 's' : ''}`, 14, 23)
  doc.setTextColor(0)

  autoTable(doc, {
    startY: 28,
    head: [EXPORT_COLUMNS],
    body: buildRows(candidates),
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      3: { halign: 'center', cellWidth: 24 },
    },
  })

  doc.save(`${filename}.pdf`)
}

export function exportToExcel(candidates, filename = 'ats-results') {
  const rows = buildRows(candidates).map(([no, name, phone, score]) => ({
    '#': no,
    'Name': name,
    'Contact No': phone,
    'ATS Score': score,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 12 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Candidates')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}
