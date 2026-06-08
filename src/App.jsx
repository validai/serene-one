import { useCallback, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import InspectionForm from './components/InspectionForm';
import ResultsGrid from './components/ResultsGrid';
import FindingsPanel from './components/FindingsPanel';
import PrintableReport from './components/PrintableReport';
import SavedReports from './components/SavedReports';
import AppFooter from './components/AppFooter';
import { saveInspectionResult } from './lib/inspectionHistory';
import { runInspection } from './models/inspection';

function App() {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const saveNoticeTimerRef = useRef(null);

  const scrollToIntake = useCallback(() => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToSavedReports = useCallback(() => {
    document.getElementById('saved-reports')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const persistResult = useCallback((inspectionResult) => {
    setResult(inspectionResult);
    if (inspectionResult.platformInspections?.length > 0) {
      const saveResult = saveInspectionResult(inspectionResult);
      setHistoryVersion((version) => version + 1);
      setSaveMessage(
        saveResult.status === 'duplicate_skipped'
          ? 'Matching report already saved.'
          : 'Report saved on this device.'
      );
      if (saveNoticeTimerRef.current) {
        clearTimeout(saveNoticeTimerRef.current);
      }
      saveNoticeTimerRef.current = setTimeout(() => {
        setSaveMessage('');
      }, 5000);
    } else {
      setSaveMessage('');
    }
  }, []);

  const handleRunInspection = useCallback(
    (data) => {
      setIsRunning(true);
      setTimeout(() => {
        const inspectionResult = runInspection(data);
        persistResult(inspectionResult);
        setIsRunning(false);
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 800);
    },
    [persistResult]
  );

  const handleViewReport = useCallback((loadedResult) => {
    setResult(loadedResult);
    setTimeout(() => {
      document.getElementById('report-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleNewReport = useCallback(() => {
    setResult(null);
    setSaveMessage('');
    setFormResetKey((key) => key + 1);
    scrollToIntake();
  }, [scrollToIntake]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onViewReports={scrollToSavedReports} />
      <main className="flex-1">
        <InspectionForm
          key={formResetKey}
          onRunInspection={handleRunInspection}
          isRunning={isRunning}
        />
        <div id="results">
          {result && (
            <>
              <ResultsGrid result={result} />
              <FindingsPanel result={result} />
            </>
          )}
        </div>
        {result && (
          <PrintableReport
            result={result}
            onPrint={handlePrint}
            onNewReport={handleNewReport}
            saveNotice={saveMessage}
          />
        )}
        <SavedReports refreshKey={historyVersion} onViewReport={handleViewReport} />
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
