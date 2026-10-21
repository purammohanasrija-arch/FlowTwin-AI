import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Edit2,
  Save,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Layers,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { MOCK_DOCUMENTS } from '../../lib/mockApi.js';
import { useAuth } from '../../lib/authContext.js';
import { useNavigate } from 'react-router-dom';

export const DocumentIntelligencePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<any[]>(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(MOCK_DOCUMENTS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [editingFields, setEditingFields] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchDocuments = () => {
    api.get<{ documents: any[] }>('/documents')
      .then(res => {
        if (res && Array.isArray(res.documents) && res.documents.length > 0) {
          setDocuments(res.documents);
          setSelectedDoc((prev: any) => prev ? (res.documents.find((d: any) => d.documentCode === prev.documentCode) || res.documents[0]) : res.documents[0]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res: any = await api.post('/documents/upload', formData);
      fetchDocuments();
      setSelectedDoc(res.document);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveFields = async () => {
    if (!selectedDoc) return;
    try {
      const updatedFields = selectedDoc.extractedFields.map((f: any) => ({
        ...f,
        value: editingFields[f.fieldName] !== undefined ? editingFields[f.fieldName] : f.value,
        correctedValue: editingFields[f.fieldName] !== undefined ? editingFields[f.fieldName] : f.correctedValue,
      }));

      const res: any = await api.patch(`/documents/${selectedDoc.documentCode}/fields`, {
        fields: updatedFields,
      });
      setSelectedDoc(res.document);
      setIsEditing(false);
      fetchDocuments();
    } catch (err: any) {
      alert(`Failed to save corrections: ${err.message}`);
    }
  };

  const handlePromoteToShipment = async () => {
    if (!selectedDoc) return;
    setIsPromoting(true);
    try {
      const res: any = await api.post(`/documents/${selectedDoc.documentCode}/confirm`);
      alert(res.message);
      fetchDocuments();
      if (res.shipment) {
        navigate(`/app/shipments?search=${res.shipment.shipmentId}`);
      }
    } catch (err: any) {
      alert(`Promotion failed: ${err.message}`);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Document Intelligence Engine</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25">
              AGENT A: PARSER ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            OCR entity extraction, multi-field confidence validation, and automated consignment promotion.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md shadow-purple-600/20 transition-all">
          <UploadCloud className="w-4 h-4" />
          <span>{isUploading ? 'Extracting Text...' : 'Upload Document'}</span>
          <input
            type="file"
            accept=".pdf,.csv,.txt,.xlsx,.docx,image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Document Ingestion Queue */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#121422] border border-[#24283E]">
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Document Ingestion Queue ({documents.length})
            </h2>
            <div className="space-y-2">
              {documents.map(doc => (
                <div
                  key={doc._id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDoc?._id === doc._id
                      ? 'bg-purple-600/15 border-purple-500/40 text-white shadow-sm'
                      : 'bg-[#161928] border-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold truncate max-w-[190px]">{doc.fileName}</span>
                    <span className="font-mono text-[10px] text-purple-400">{doc.fileType.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                    <span>{doc.documentCode}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        doc.processingStatus === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : doc.processingStatus === 'flagged_discrepancy'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-purple-500/10 text-purple-300'
                      }`}
                    >
                      {doc.processingStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Documents Guide */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#121422] to-[#161928] border border-white/[0.06] text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Format Ingestion</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Upload any PDF Bill of Lading, CSV manifest, commercial invoice, or logistics text. The Document Intelligence Agent will automatically isolate shipment IDs, PO numbers, weight metrics, and destination facilities.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Extracted Fields & Human Verification */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDoc ? (
            <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E] space-y-5">
              {/* Document Overview Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white font-mono">{selectedDoc.fileName}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedDoc.validationStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Code: {selectedDoc.documentCode} | Category: {selectedDoc.documentCategory.replace('_', ' ').toUpperCase()} | Size: {selectedDoc.fileSizeKB} KB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        const initEdit: Record<string, any> = {};
                        selectedDoc.extractedFields.forEach((f: any) => {
                          initEdit[f.fieldName] = f.correctedValue !== undefined ? f.correctedValue : f.value;
                        });
                        setEditingFields(initEdit);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 border border-white/[0.08] text-xs font-semibold transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Correct Fields</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveFields}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Corrections</span>
                    </button>
                  )}

                  <button
                    onClick={handlePromoteToShipment}
                    disabled={isPromoting || selectedDoc.processingStatus === 'confirmed'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/20"
                  >
                    <span>{selectedDoc.processingStatus === 'confirmed' ? 'Promoted' : 'Promote to Shipment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Duplicate or Discrepancy Alert */}
              {selectedDoc.duplicateCandidateId && (
                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-amber-300">Duplicate Candidate Detected</div>
                    <div className="text-gray-300 mt-0.5">
                      Shipment <b className="font-mono">{selectedDoc.duplicateCandidateId}</b> already exists in database. Verifying and promoting will update the live consignment telemetry.
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Fields Table */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Extracted Structured Fields & Evidence
                </div>
                <div className="divide-y divide-[#1E2238] border border-[#24283E] rounded-xl overflow-hidden bg-[#161928]">
                  {selectedDoc.extractedFields?.map((field: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="w-48 shrink-0">
                        <div className="font-medium text-white">{field.label}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{field.fieldName}</div>
                      </div>

                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingFields[field.fieldName] ?? field.value}
                            onChange={e => setEditingFields({ ...editingFields, [field.fieldName]: e.target.value })}
                            className="w-full bg-[#0E101B] border border-purple-500/40 rounded px-2.5 py-1 text-xs text-white"
                          />
                        ) : (
                          <div className="font-semibold text-purple-200 font-mono text-xs">
                            {field.correctedValue !== undefined ? field.correctedValue : String(field.value)}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-400 mt-1 italic">
                          Snippet: &quot;{field.sourceSnippet}&quot;
                        </div>
                      </div>

                      <div className="w-32 shrink-0 flex items-center justify-end gap-2">
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400 font-mono">
                            {Math.round((field.confidenceScore || 0.95) * 100)}% Conf
                          </div>
                          <div className="w-16 h-1 bg-black/40 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${Math.round((field.confidenceScore || 0.95) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Document Text Snippet */}
              {selectedDoc.rawTextPreview && (
                <div className="p-4 rounded-xl bg-[#0A0B12] border border-[#24283E] space-y-2">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Raw Document Text Snippet
                  </div>
                  <pre className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {selectedDoc.rawTextPreview}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-[#121422] rounded-xl border border-[#24283E]">
              Select a document from the queue or upload a new file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
