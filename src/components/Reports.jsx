import React, { useState, useEffect, useRef } from "react";
// import html2pdf from 'html2pdf.js';
import "../styles/Reports.css";

const Reports = ({ user }) => {
  const reportRef = useRef();
  const [reportType, setReportType] = useState("completion");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksResponse = await fetch("http://localhost:5000/api/tasks", {
        headers: { "x-user-email": user.email },
      });
      const tasksData = await tasksResponse.json();
      if (tasksData.success) {
        setTasks(tasksData.tasks);
      }

      const empResponse = await fetch(
        "http://localhost:5000/api/auth/employees",
        {
          headers: { "x-admin-email": user.email },
        },
      );
      const empData = await empResponse.json();
      if (empData.success) {
        setEmployees(empData.employees);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateReport = () => {
    setLoading(true);

    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return (
        taskDate >= new Date(dateRange.startDate) &&
        taskDate <= new Date(dateRange.endDate)
      );
    });

    let report = {};

    switch (reportType) {
      case "completion":
        report = generateCompletionReport(filteredTasks);
        break;
      case "employee":
        report = generateEmployeeReport(filteredTasks);
        break;
      case "department":
        report = generateDepartmentReport(filteredTasks);
        break;
      default:
        report = generateCompletionReport(filteredTasks);
    }

    setReportData(report);
    setLoading(false);
  };

  const generateCompletionReport = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const overdue = tasks.filter(
      (t) => new Date(t.deadline) < new Date() && t.status !== "Completed",
    ).length;

    const byPriority = {
      low: tasks.filter((t) => t.priority === "Low").length,
      medium: tasks.filter((t) => t.priority === "Medium").length,
      high: tasks.filter((t) => t.priority === "High").length,
      critical: tasks.filter((t) => t.priority === "Critical").length,
    };

    return {
      type: "Task Completion Report",
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0,
      byPriority,
    };
  };

  const generateEmployeeReport = (tasks) => {
    const employeeStats = employees
      .map((emp) => {
        const empTasks = tasks.filter((t) => t.assignedTo?._id === emp._id);
        const completed = empTasks.filter(
          (t) => t.status === "Completed",
        ).length;

        return {
          name: emp.name,
          department: emp.department,
          assigned: empTasks.length,
          completed,
          pending: empTasks.filter((t) => t.status === "Pending").length,
          inProgress: empTasks.filter((t) => t.status === "In Progress").length,
          completionRate: empTasks.length
            ? ((completed / empTasks.length) * 100).toFixed(1)
            : 0,
        };
      })
      .filter((emp) => emp.assigned > 0);

    return {
      type: "Employee Performance Report",
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      employees: employeeStats,
      totalEmployees: employeeStats.length,
    };
  };

  const generateDepartmentReport = (tasks) => {
    const departments = [...new Set(tasks.map((t) => t.department))];

    const deptStats = departments.map((dept) => {
      const deptTasks = tasks.filter((t) => t.department === dept);
      const completed = deptTasks.filter(
        (t) => t.status === "Completed",
      ).length;

      return {
        department: dept,
        total: deptTasks.length,
        completed,
        inProgress: deptTasks.filter((t) => t.status === "In Progress").length,
        pending: deptTasks.filter((t) => t.status === "Pending").length,
        completionRate: deptTasks.length
          ? ((completed / deptTasks.length) * 100).toFixed(1)
          : 0,
      };
    });

    return {
      type: "Department Performance Report",
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      departments: deptStats,
      totalTasks: tasks.length,
    };
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      alert("Please generate a report first");
      return;
    }

    const element = reportRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${reportData.type.replace(/\s+/g, "_")}_${dateRange.startDate}_to_${dateRange.endDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  if (!user || user.userType !== "admin") {
    return (
      <div className="reports-unauthorized">
        <i className="fas fa-lock"></i>
        <h2>Access Denied</h2>
        <p>Only administrators can view reports.</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Generate insights and track performance</p>
      </div>

      <div className="reports-controls">
        <div className="controls-grid">
          <div className="control-group">
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="completion">Task Completion Report</option>
              <option value="employee">Employee Performance Report</option>
              <option value="department">Department Overview Report</option>
            </select>
          </div>

          <div className="control-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>

          <div className="control-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>

          <div className="control-group actions">
            <button
              onClick={generateReport}
              className="btn-generate"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-chart-bar"></i> Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {/* PDF Export Button - Outside the report */}
          <div className="pdf-export-container">
            <button onClick={handleExportPDF} className="btn-pdf">
              <i className="fas fa-file-pdf"></i> Download PDF
            </button>
          </div>

          {/* Report Content - This is what gets exported to PDF */}
          <div className="report-result" ref={reportRef}>
            <div className="report-header">
              <div className="university-header">
                <h1>Umaru Musa Yar'adua University Katsina</h1>
                <p>Task Management System - Official Report</p>
              </div>
              <div>
                <h2>{reportData.type}</h2>
                <p className="report-period">Period: {reportData.period}</p>
                <p className="report-date">
                  Generated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {reportType === "completion" && (
              <div className="completion-report">
                <div className="summary-cards">
                  <div className="summary-card total">
                    <h3>Total Tasks</h3>
                    <p className="value">{reportData.total}</p>
                  </div>
                  <div className="summary-card completed">
                    <h3>Completed</h3>
                    <p className="value">{reportData.completed}</p>
                  </div>
                  <div className="summary-card in-progress">
                    <h3>In Progress</h3>
                    <p className="value">{reportData.inProgress}</p>
                  </div>
                  <div className="summary-card pending">
                    <h3>Pending</h3>
                    <p className="value">{reportData.pending}</p>
                  </div>
                  <div className="summary-card overdue">
                    <h3>Overdue</h3>
                    <p className="value">{reportData.overdue}</p>
                  </div>
                </div>

                <div className="completion-rate">
                  <div className="rate-card">
                    <h3>Completion Rate</h3>
                    <div className="progress-circle">
                      <span>{reportData.completionRate}%</span>
                    </div>
                  </div>

                  <div className="priority-stats">
                    <h3>Tasks by Priority</h3>
                    <table className="priority-table">
                      <thead>
                        <tr>
                          <th>Priority</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Low</td>
                          <td>{reportData.byPriority.low}</td>
                          <td>
                            {(
                              (reportData.byPriority.low / reportData.total) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                        <tr>
                          <td>Medium</td>
                          <td>{reportData.byPriority.medium}</td>
                          <td>
                            {(
                              (reportData.byPriority.medium /
                                reportData.total) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                        <tr>
                          <td>High</td>
                          <td>{reportData.byPriority.high}</td>
                          <td>
                            {(
                              (reportData.byPriority.high / reportData.total) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                        <tr>
                          <td>Critical</td>
                          <td>{reportData.byPriority.critical}</td>
                          <td>
                            {(
                              (reportData.byPriority.critical /
                                reportData.total) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reportType === "employee" && (
              <div className="employee-report">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Assigned</th>
                      <th>Completed</th>
                      <th>In Progress</th>
                      <th>Pending</th>
                      <th>Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.employees.map((emp, index) => (
                      <tr key={index}>
                        <td>{emp.name}</td>
                        <td>{emp.department}</td>
                        <td>{emp.assigned}</td>
                        <td>{emp.completed}</td>
                        <td>{emp.inProgress}</td>
                        <td>{emp.pending}</td>
                        <td>{emp.completionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === "department" && (
              <div className="department-report">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Tasks</th>
                      <th>Completed</th>
                      <th>In Progress</th>
                      <th>Pending</th>
                      <th>Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.departments.map((dept, index) => (
                      <tr key={index}>
                        <td>{dept.department}</td>
                        <td>{dept.total}</td>
                        <td>{dept.completed}</td>
                        <td>{dept.inProgress}</td>
                        <td>{dept.pending}</td>
                        <td>{dept.completionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="report-footer">
              <p>
                This is an official report generated by Umaru Musa Yar'adua
                University Katsina Task Management System
              </p>
              <p>Report ID: {Date.now()}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
