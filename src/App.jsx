import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import InspectionForm from './components/InspectionForm';
import ResultsGrid from './components/ResultsGrid';
import FindingsPanel from './components/FindingsPanel';
import PrintableReport from './components/PrintableReport';
import SavedReports from './components/SavedReports';
import { saveInspectionResult } from './lib/inspectionHistory';
import { runInspection } from './models/inspection';

function App() {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [formResetKey, setFormResetKey] = useState(0);

  const scrollToIntake = useCallback(() => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToSavedReports = useCallback(() => {
    document.getElementById('saved-reports')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const persistResult = useCallback((inspectionResult) => {
    setResult(inspectionResult);
    if (inspectionResult.platformInspections?.length > 0) {
      saveInspectionResult(inspectionResult);
      setHistoryVersion((version) => version + 1);
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
    setFormResetKey((key) => key + 1);
    scrollToIntake();
  }, [scrollToIntake]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onViewReports={scrollToSavedReports} />
      <main>
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
          />
        )}
        <SavedReports refreshKey={historyVersion} onViewReport={handleViewReport} />
      </main>
    </div>
  );
}

export default App;
