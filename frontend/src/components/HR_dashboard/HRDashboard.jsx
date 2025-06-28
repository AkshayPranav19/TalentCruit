// //work in progress
// import React, { useState, useEffect } from 'react';
// import { Search, Filter, X, Eye, Check, Clock, UserCheck } from 'lucide-react';

// export default function HRDashboard() {
//   const [applicants, setApplicants] = useState([]);
//   const [filteredApplicants, setFilteredApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedFeedback, setExpandedFeedback] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     resumeDone: 'all',
//     codingDone: 'all',
//     minScore: ''
//   });

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const res = await fetch('http://localhost:3001/get-all-users');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();
//         const sorted = data.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
//         setApplicants(sorted);
//         setFilteredApplicants(sorted);
//       } catch (err) {
//         console.error('Error fetching applicants:', err);
//         setError('Failed to load applicants');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicants();
//   }, []);

//   useEffect(() => {
//     let filtered = [...applicants];

//     // Search filter
//     if (filters.search) {
//       filtered = filtered.filter(a => 
//         a.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
//         a.email?.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     // Status filter
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(a => a.accepted === filters.status);
//     }

//     // Resume completion filter
//     if (filters.resumeDone !== 'all') {
//       filtered = filtered.filter(a => 
//         filters.resumeDone === 'true' ? a.completed_resume : !a.completed_resume
//       );
//     }

//     // Coding completion filter
//     if (filters.codingDone !== 'all') {
//       filtered = filtered.filter(a => 
//         filters.codingDone === 'true' ? a.completed_coding : !a.completed_coding
//       );
//     }

//     // Minimum score filter
//     if (filters.minScore) {
//       filtered = filtered.filter(a => (a.totalScore || 0) >= parseInt(filters.minScore));
//     }

//     setFilteredApplicants(filtered);
//   }, [applicants, filters]);

//   const handleAccept = async (applicantId, email) => {
//     try {
//       // Update local state immediately for better UX
//       setApplicants(prev => 
//         prev.map(a => 
//           a.email === email ? { ...a, accepted: 'accepted' } : a
//         )
//       );

//       // Make API call to update backend
//       const response = await fetch(`http://localhost:3001/update-status/${applicantId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ accepted: 'accepted' })
//       });

//       if (!response.ok) throw new Error('Failed to update status');
//     } catch (err) {
//       console.error('Error updating status:', err);
//       // Revert state on error
//       setApplicants(prev => 
//         prev.map(a => 
//           a.email === email ? { ...a, accepted: 'waitlist' } : a
//         )
//       );
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'waitlist': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'accepted': return <UserCheck className="w-4 h-4" />;
//       case 'rejected': return <X className="w-4 h-4" />;
//       case 'waitlist': return <Clock className="w-4 h-4" />;
//       default: return <Clock className="w-4 h-4" />;
//     }
//   };

//   const truncateText = (text, maxLength = 100) => {
//     if (!text) return '';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
//           <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!applicants.length) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center text-gray-500">
//           <h2 className="text-xl font-semibold mb-2">No Applicants Found</h2>
//           <p>There are currently no applicants in the system.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
//           <p className="text-gray-600">Manage and review all job applicants</p>
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="font-semibold text-blue-800">Total Applicants</div>
//               <div className="text-2xl font-bold text-blue-600">{applicants.length}</div>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="font-semibold text-green-800">Accepted</div>
//               <div className="text-2xl font-bold text-green-600">
//                 {applicants.filter(a => a.accepted === 'accepted').length}
//               </div>
//             </div>
//             <div className="bg-yellow-50 p-3 rounded-lg">
//               <div className="font-semibold text-yellow-800">Waitlist</div>
//               <div className="text-2xl font-bold text-yellow-600">
//                 {applicants.filter(a => a.accepted === 'waitlist').length}
//               </div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg">
//               <div className="font-semibold text-purple-800">Avg Score</div>
//               <div className="text-2xl font-bold text-purple-600">
//                 {Math.round(applicants.reduce((sum, a) => sum + (a.totalScore || 0), 0) / applicants.length)}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-gray-500" />
//             <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.search}
//                 onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//               />
//             </div>
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filters.status}
//               onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//             >
//               <option value="all">All Status</option>
//               <option value="accepted">Accepted</option>
//               <option value="waitlist">Waitlist</option>
//               <option value="rejected">Rejected</option>
//             </select>
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filters.resumeDone}
//               onChange={(e) => setFilters(prev => ({ ...prev, resumeDone: e.target.value }))}
//             >
//               <option value="all">Resume Status</option>
//               <option value="true">Resume Done</option>
//               <option value="false">Resume Pending</option>
//             </select>
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filters.codingDone}
//               onChange={(e) => setFilters(prev => ({ ...prev, codingDone: e.target.value }))}
//             >
//               <option value="all">Coding Status</option>
//               <option value="true">Coding Done</option>
//               <option value="false">Coding Pending</option>
//             </select>
//             <input
//               type="number"
//               placeholder="Min Score"
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filters.minScore}
//               onChange={(e) => setFilters(prev => ({ ...prev, minScore: e.target.value }))}
//             />
//           </div>
//           <div className="mt-4 text-sm text-gray-600">
//             Showing {filteredApplicants.length} of {applicants.length} applicants
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Coding</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Scores</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPT Feedback</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredApplicants.map((applicant, index) => (
//                   <tr key={applicant.email || index} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {index + 1}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
//                         <div className="text-sm text-gray-500">{applicant.email}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         applicant.completed_resume 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {applicant.completed_resume ? '✅ Done' : '❌ Pending'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         applicant.completed_coding 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {applicant.completed_coding ? '✅ Done' : '❌ Pending'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <div className="text-sm text-gray-900">
//                         <div>ML: <span className="font-semibold">{applicant.mlScore || 0}</span></div>
//                         <div>Code: <span className="font-semibold">{applicant.codeScore || 0}</span></div>
//                         <div className="font-bold text-blue-600">Total: {applicant.totalScore || 0}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 max-w-xs">
//                       <div className="text-sm text-gray-900">
//                         {truncateText(applicant.gptFeedback)}
//                         {applicant.gptFeedback && applicant.gptFeedback.length > 100 && (
//                           <button
//                             onClick={() => setExpandedFeedback(applicant)}
//                             className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(applicant.accepted)}`}>
//                         {getStatusIcon(applicant.accepted)}
//                         {applicant.accepted || 'waitlist'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       {applicant.accepted !== 'accepted' && (
//                         <button
//                           onClick={() => handleAccept(applicant._id, applicant.email)}
//                           className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
//                         >
//                           <Check className="w-3 h-3 mr-1" />
//                           Accept
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Feedback Modal */}
//         {expandedFeedback && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden">
//               <div className="flex items-center justify-between p-6 border-b">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   GPT Feedback - {expandedFeedback.name}
//                 </h3>
//                 <button
//                   onClick={() => setExpandedFeedback(null)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="p-6 overflow-y-auto max-h-80">
//                 <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                   {expandedFeedback.gptFeedback}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }