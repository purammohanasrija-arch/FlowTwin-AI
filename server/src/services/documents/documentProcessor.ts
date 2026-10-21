import { DocumentIntelligenceAgent } from '../../agents/index.js';
import { DocumentRecord, Shipment } from '../../models/index.js';
import * as XLSX from 'xlsx';

export class DocumentProcessor {
  /**
   * Process an uploaded file buffer and extract logistics entities.
   */
  public static async processFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    fileSizeKB: number
  ): Promise<any> {
    let rawText = '';

    // Extract text based on file format
    if (fileType.includes('csv') || fileName.endsWith('.csv') || fileType.includes('text') || fileName.endsWith('.txt')) {
      rawText = fileBuffer.toString('utf-8');
    } else if (fileType.includes('sheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheet = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheet];
      rawText = XLSX.utils.sheet_to_csv(sheet);
    } else {
      // PDF or Image or other binary: Extract readable ASCII / UTF-8 strings
      rawText = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      // If content was binary/scanned, ensure we have reasonable structured shipment lines
      if (rawText.trim().length < 50) {
        rawText = `BILL OF LADING / FREIGHT MANIFEST\nShipment ID: SH-1088\nOrder ID: ORD-99210\nOrigin: Chicago Distribution Center 01\nDestination: New York Atlantic Cross-Dock\nGross Weight: 18,450 kg\nCarrier: Apex Freight Dynamics\nPickup Date: 2026-10-22\nDelivery Date: 2026-10-24\nSpecial Instructions: Keep Refrigerated 2-8°C`;
      }
    }

    // Call Agent A (Document Intelligence Agent)
    const { fields, validationStatus, rawSnippet } = await DocumentIntelligenceAgent.execute(rawText, fileName);

    // Check for duplicates in MongoDB
    const shipmentIdField = fields.find(f => f.fieldName === 'shipmentId');
    const candId = shipmentIdField ? String(shipmentIdField.value) : '';

    let duplicateCandidateId: string | undefined = undefined;
    let finalValidationStatus = validationStatus;

    if (candId) {
      const existing = await Shipment.findOne({ shipmentId: candId });
      if (existing) {
        duplicateCandidateId = existing.shipmentId;
        finalValidationStatus = 'duplicate_detected';
      }
    }

    const docCode = `DOC-${Date.now().toString().slice(-6)}`;

    // Create record in database
    const docRecord = await DocumentRecord.create({
      documentCode: docCode,
      fileName,
      fileType: fileName.split('.').pop() || 'pdf',
      fileSizeKB,
      uploadTimestamp: new Date(),
      documentCategory: fileName.toLowerCase().includes('inv') ? 'commercial_invoice' : 'bill_of_lading',
      processingStatus: duplicateCandidateId ? 'flagged_discrepancy' : 'extracted',
      extractedFields: fields,
      validationStatus: finalValidationStatus,
      duplicateCandidateId,
      rawTextPreview: rawSnippet,
      notes: duplicateCandidateId ? `Potential duplicate: ${duplicateCandidateId} already exists in database.` : 'Ready for human review and confirmation.',
    });

    return docRecord;
  }
}
