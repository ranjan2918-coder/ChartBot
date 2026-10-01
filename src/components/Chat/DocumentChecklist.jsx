import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, HelpCircle, Download } from 'lucide-react';
import './DocumentChecklist.css';

const DocumentChecklist = ({ schemeName, docs }) => {
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (doc) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  const completedCount = Object.values(checkedDocs).filter(Boolean).length;
  const isComplete = completedCount === docs.length;

  return (
    <div className={`doc-checklist ${isComplete ? 'complete' : ''}`}>
      <div className="checklist-header">
        <div className="checklist-title-group">
          <h3>Documents needed for {schemeName}</h3>
          <span className="checklist-progress">
            {completedCount} of {docs.length} Ready
          </span>
        </div>
        {isComplete && (
          <div className="success-badge">
            <CheckCircle2 size={16} />
            <span>Ready to apply</span>
          </div>
        )}
      </div>

      <div className="checklist-items">
        {docs.map((doc, idx) => (
          <div 
            key={idx} 
            className={`checklist-item ${checkedDocs[doc] ? 'checked' : ''}`}
            onClick={() => toggleDoc(doc)}
          >
            <div className="check-icon">
              {checkedDocs[doc] ? (
                <CheckCircle2 size={24} className="icon-success" />
              ) : (
                <Circle size={24} className="icon-empty" />
              )}
            </div>
            <div className="item-content">
              <span className="doc-name">{doc}</span>
              {!checkedDocs[doc] && (
                <button className="help-link">
                  <HelpCircle size={12} />
                  <span>Don't have this?</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isComplete ? (
        <button className="action-button-primary">
          <Download size={18} />
          <span>Download Checklist (PDF)</span>
        </button>
      ) : (
        <div className="checklist-info">
          <AlertCircle size={14} />
          <p>Check off the documents you already have to see what's left.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentChecklist;
