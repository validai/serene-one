import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InspectionForm from './components/InspectionForm';
import ResultsGrid from './components/ResultsGrid';
import FindingsPanel from './components/FindingsPanel';
import PrintableReport from './components/PrintableReport';
import { runInspection } from './lib/gradingEngine';

const SAMPLE_INSPECTION = {
  businessName: 'Sample Business Co.',
  businessType: 'Local Business',
  uploadedPlatforms: ['Google Business Profile', 'Website', 'Facebook', 'Instagram'],
};

function App() {
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const scrollToInspection = useCallback(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleRunInspection = useCallback((data) => {
    setIsRunning(true);
    setTimeout(() => {
      const inspectionResult = runInspection(data);
      setResult(inspectionResult);
      setIsRunning(false);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 800);
  }, []);

  const handleViewSample = useCallback(() => {
    const sampleResult = runInspection(SAMPLE_INSPECTION);
    setResult(sampleResult);
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
      </main>
      <footer className="no-print border-t border-serene-100 py-10">
        <div className="section-container text-center">
          <p className="text-sm font-medium text-serene-900">Serene One</p>
          <p className="mt-1 text-xs text-serene-400">
            Platform Health Inspection · Version 1.0
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
