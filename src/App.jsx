import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyThisMatters from './components/WhyThisMatters';
import InspectionForm from './components/InspectionForm';
import ResultsGrid from './components/ResultsGrid';
import FindingsPanel from './components/FindingsPanel';
import PrintableReport from './components/PrintableReport';
import InspectionHistory from './components/InspectionHistory';
import { saveInspectionResult } from './lib/inspectionHistory';
import {
  runInspection,
  createSampleInspection,
  runInspectionPipeline,
  formatPipelineResultForDisplay,
} from './models/inspection';

function App() {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  const scrollToInspection = useCallback(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
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

  const handleViewSample = useCallback(() => {
    const sampleResult = formatPipelineResultForDisplay(
      runInspectionPipeline(createSampleInspection())
    );
    persistResult(sampleResult);
    setTimeout(() => {
      document.getElementById('report-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [persistResult]);

  const handleLoadReport = useCallback((loadedResult) => {
    setResult(loadedResult);
    setTimeout(() => {
      document.getElementById('report-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartInspection={scrollToInspection} />
      <main>
        <Hero onStartInspection={scrollToInspection} onViewSample={handleViewSample} />
        <WhyThisMatters />
        <InspectionForm onRunInspection={handleRunInspection} isRunning={isRunning} />
        <div id="results">
          {result && (
            <>
              <ResultsGrid result={result} />
              <FindingsPanel result={result} />
            </>
          )}
        </div>
        {result && <PrintableReport result={result} onPrint={handlePrint} />}
        <InspectionHistory refreshKey={historyVersion} onLoadReport={handleLoadReport} />
      </main>
      <footer className="no-print border-t border-serene-border py-12 sm:py-16">
        <div className="section-container">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-serif text-base font-medium text-serene-navy">Serene One</p>
              <p className="mt-1 text-sm text-serene-muted">
                Platform Health Inspection Services
              </p>
            </div>
            <div className="text-sm leading-relaxed text-serene-muted">
              <p>Independent digital presence assessments</p>
              <p className="mt-1">Point-in-time · Client-ready deliverables</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
