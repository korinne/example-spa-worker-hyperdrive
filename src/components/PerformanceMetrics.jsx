
function PerformanceMetrics({ performance }) {
  return (
    <section className="mb-12">
      <h3 className="mb-6">Performance Metrics</h3>
      
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-value">{performance.totalQueries}</div>
          <div className="metric-label">Database Queries</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {performance.totalDbTime ? Math.round(performance.totalDbTime) : 0}
            <span className="text-base ml-1 font-sans text-gray-500">ms</span>
          </div>
          <div className="metric-label">Total DB Time</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {performance.responseTime ? Math.round(performance.responseTime) : '-'}
            <span className="text-base ml-1 font-sans text-gray-500">ms</span>
          </div>
          <div className="metric-label">API Response</div>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-gray-900 mb-2">Hyperdrive Performance</h4>
        <p className="text-gray-600">{performance.hyperdriveBenefit || "Using Cloudflare Hyperdrive to optimize multiple database round trips within a single API request."}</p>
      </div>
      
      {performance.queryDetails && performance.queryDetails.length > 0 && (
        <div>
          <h4 className="text-gray-900 mb-4">Individual Query Performance</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {performance.queryDetails.map((query, index) => (
                <tr key={index}>
                  <td>{query.query}</td>
                  <td>{Math.round(query.time)} <span className="text-gray-500">ms</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PerformanceMetrics;