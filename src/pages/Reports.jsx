import { useState } from 'react';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import ReportFilters from '../components/Reports/ReportFilters.jsx';
import ReportSummary from '../components/Reports/ReportSummary.jsx';
import ReportTable from '../components/Reports/ReportTable.jsx';
import Button from '../components/UI/Button.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { Sk, SkStats } from '../components/UI/Skeleton.jsx';

const today = new Date().toISOString().split('T')[0];
const monthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

export default function Reports() {
  const toast = useToast();
  const [filters, setFilters] = useState({ type: 'completion', startDate: monthAgo, endDate: today });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setData(null);
    try {
      const params = new URLSearchParams({ type: filters.type, startDate: filters.startDate, endDate: filters.endDate });
      const res = await api.get('/api/reports?' + params.toString());
      setData(res);
    } catch (e) {
      toast.error(e.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams({ type: filters.type, startDate: filters.startDate, endDate: filters.endDate });
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/reports/pdf?' + params.toString(), {
        headers: { 'x-user-email': JSON.parse(localStorage.getItem('stm_user') || '{}').email || '' },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filters.type + '_report.pdf';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (e) {
      toast.error(e.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-subtitle">View and export system reports</div>
        </div>
        {data && (
          <Button variant="primary" icon="fa-file-pdf" loading={downloading} onClick={downloadPDF}>
            Export PDF
          </Button>
        )}
      </div>

      <ReportFilters value={filters} onChange={setFilters} onGenerate={generate} loading={loading} />

      {loading && (
        <>
          <SkStats count={5} />
          <div className="card" style={{ padding: 24 }}>
            <Sk h={40} w="40%" className="mb-3" />
            <Sk h={220} r={12} />
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="card">
          <EmptyState
            icon="fa-chart-pie"
            title="No report generated"
            text="Choose a report type and click generate"
          />
        </div>
      )}

      {!loading && data && data.type === 'Task Completion Report' && (
        <>
          <ReportSummary summary={data.summary} />

          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Completion Rate</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                background: 'conic-gradient(var(--primary) 0% ' + data.summary.completionRate + '%, #f1f2f4 ' + data.summary.completionRate + '% 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 92, height: 92, borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700,
                }}>{data.summary.completionRate}%</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Tasks by Priority</h4>
                {Object.entries(data.summary.byPriority).map(([k, v]) => {
                  const pct = data.summary.total ? (v / data.summary.total) * 100 : 0;
                  return (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 40px', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 12.5, textTransform: 'capitalize' }}>{k}</span>
                      <div style={{ height: 8, background: '#f1f2f4', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: pct + '%',
                          background: k === 'critical' ? 'var(--danger)' : k === 'high' ? '#f97316' : k === 'medium' ? 'var(--warning)' : 'var(--success)',
                          borderRadius: 4, transition: 'width .5s',
                        }} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && data && data.type === 'Employee Performance Report' && (
        <div className="card">
          <div className="card-header"><h3>Employee Performance</h3></div>
          <ReportTable
            columns={['Employee', 'Department', 'Assigned', 'Completed', 'In Progress', 'Pending', 'Rate']}
            rows={data.rows.map((r) => [r.name, r.department, r.assigned, r.completed, r.inProgress, r.pending, r.rate + '%'])}
          />
        </div>
      )}

      {!loading && data && data.type === 'Department Performance Report' && (
        <div className="card">
          <div className="card-header"><h3>Department Overview</h3></div>
          <ReportTable
            columns={['Department', 'Total', 'Completed', 'In Progress', 'Pending', 'Rate']}
            rows={data.rows.map((r) => [r.department, r.total, r.completed, r.inProgress, r.pending, r.rate + '%'])}
          />
        </div>
      )}
    </div>
  );
}
