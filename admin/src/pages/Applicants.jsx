import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
const API_URL = 'https://talentcruit.onrender.com'

const Applicants = () => {

    const [applicants, setApplicants] = useState([])
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [editingId, setEditingId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleDecision = async (userEmail, newStatus) => {
        try {
            const response = await axios.put(
            `${API_URL}/update-user-by-email`,
            { email: userEmail, accepted: newStatus }
            )
            setApplicants(prev =>
                prev.map(a =>
                    a.email === userEmail ? response.data : a
                )
            )
        } catch (error) {
            console.error(
            'Error updating status:',
            error.response?.data || error.message
            )
        }
    }

    const handleSaveInterview = async (email) => {
        try {
            if (!selectedDate || !selectedTime) return;

            const combinedISO = `${selectedDate}T${selectedTime}`;
            const dateObj = new Date(combinedISO);

            if (isNaN(dateObj.getTime())) throw new Error("Invalid date or time");

            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const year = dateObj.getFullYear();
            const hour = dateObj.getHours();
            const minute = dateObj.getMinutes();
            const suffix = hour >= 12 ? 'pm' : 'am';
            const hour12 = hour % 12 === 0 ? 12 : hour % 12;

            const paddedMinute = minute.toString().padStart(2, '0');

            const formatted = `${day}/${month}/${year} ${hour12}:${paddedMinute}${suffix}`;

            const response = await axios.put(`${API_URL}/update-user-by-email`, {
            email,
            interviewDate: formatted,
            });

            setApplicants(prev =>
            prev.map(app =>
                app.email === email ? response.data : app
            )
            );

            setEditingId(null);
            setSelectedDate('');
            setSelectedTime('');
        } catch (error) {
            console.error("Error scheduling interview:", error.response?.data || error.message);
        }
    };

    const fetchApplicant = async () => {
        try {
            const res = await fetch(`${API_URL}/get-all-users`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            data.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
            setApplicants(data)
        } catch (err) {
            console.error('Error fetching applicants:', err)
        }
    }

    useEffect(()=>{
        fetchApplicant()
    },[])

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'waitlist':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
            }
        };
const getInterviewStatusClass = (interviewDateStr) => {
  if (!interviewDateStr || interviewDateStr.trim() === '') {
    return 'bg-yellow-100 text-yellow-800'; // Not scheduled
  }

  const match = interviewDateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2})(?::(\d{2}))?(am|pm)$/i);

  if (!match) return 'bg-yellow-100 text-yellow-800'; // Fallback

  const [, day, month, year, hourRaw, minuteRaw = '0', suffix] = match;

  let hour = parseInt(hourRaw, 10);
  const minute = parseInt(minuteRaw, 10);

  if (suffix.toLowerCase() === 'pm' && hour !== 12) hour += 12;
  if (suffix.toLowerCase() === 'am' && hour === 12) hour = 0;

  const interviewDate = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  return interviewDate < now
    ? 'bg-red-100 text-red-800'    // Missed
    : 'bg-green-100 text-green-800'; // Scheduled
};

  return (
    
     <div className='px-3 pt-2 md:px-3 w-full'>
        <h1 className='text-3xl font-semibold text-gray-900 mb-2'>Applicants</h1>
        <p className='text-gray-600 text-base'>
    Manage applicants and application process including their outcomes, interviews and application metrics
        </p>

        <div className='max-w-7xl w-full rounded-md overflow-hidden border border-gray-200 mt-6'>
            <table className= 'w-full border-collapse text-left text-sm text-gray-900'>
                <thead className='text-gray-600'>
                    <tr>
                        <th className='p-3 font-medium'>Name</th>
                        <th className='p-3 font-medium'>Job<br />Role</th>
                        <th className='p-3 font-medium'>Resume<br />Submission</th>
                        <th className='p-3 font-medium'>Coding<br />Completed</th>
                        <th className='p-3 font-medium'>Total<br />Score</th>
                        <th className='p-3 font-medium'>Coding<br />Score</th>
                        <th className='p-3 font-medium'>Status</th>
                        <th className='p-3 font-medium'>AI <br />Feedback</th>
                        <th className='p-3 font-medium'>Actions</th>
                        <th className='p-3 font-medium'>Schedule<br />Interview</th>
                    </tr>
                </thead>
                    <tbody>
                        {applicants.map((applicant, index) => (
                            <tr key={index} className='border-t border-gray-200'>
                                <td className='p-3'>{applicant.name}</td>
                                <td className='p-3'>{applicant.job_role}</td>
                                <td className='p-3'>{applicant.completed_resume ? '✅' : '❌'}</td>
                                <td className='p-3'>{applicant.completed_coding ? '✅' : '❌'}</td>
                                <td className='p-3'>{applicant.totalScore}</td>
                                <td className='p-3'>{applicant.codeScore}</td>
                                <td className="p-3">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(applicant.accepted)}`}>
                                        {applicant.accepted}
                                    </span>
                                    </td>
                                <td className='p-3 text-blue-500 hover:underline cursor-pointer'
                                onClick={() => setSelectedFeedback(applicant.gptFeedback)}
                                >View</td>
                                <td className="p-3 flex flex-col items-center space-y-2">
                                <button
                                    onClick={() => handleDecision(applicant.email, 'accepted')}
                                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleDecision(applicant.email, 'rejected')}
                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                                </td>


                                <td className="p-3 text-left">
                                <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getInterviewStatusClass(applicant.interviewDate)}`}
                                >
                                {applicant.interviewDate && applicant.interviewDate.trim() !== ''
                                    ? applicant.interviewDate
                                    : 'Not Scheduled'}
                                </span>

                                {editingId === applicant.email ? (
                                    <div className="mt-2 space-y-1">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    />
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="border px-2 py-1 rounded ml-2"
                                    />
                                    <div className="mt-2 space-x-2">
                                        <button
                                        onClick={() => handleSaveInterview(applicant.email)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                        Save
                                        </button>
                                        <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setSelectedDate('');
                                            setSelectedTime('');
                                        }}
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                                        >
                                        Cancel
                                        </button>
                                    </div>
                                    </div>
                                ) : (
                                    <div className="mt-1">
                                    <button
                                        onClick={() => setEditingId(applicant.email)}
                                        className="text-xs text-blue-600 underline"
                                    >
                                        Schedule
                                    </button>
                                    </div>
                                )}
                                </td>
                            </tr>

                        ))}
                    </tbody>

            </table>

        </div>
        {selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
            className="
                bg-white 
                rounded-md 
                shadow-lg 
                max-w-md    
                w-11/12     
                max-h-[60vh] 
                overflow-y-auto 
                p-4 
                relative
                z-50
            "
            >
            <button
                onClick={() => setSelectedFeedback(null)}
                className="absolute top-2 right-2 hover:text-red-700"
            >
                ❌
            </button>

            <h2 className="text-xl font-semibold mb-3">LLM Feedback</h2>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {selectedFeedback}
            </div>
            </div>
        </div>
        )}

    </div>

  )
}

export default Applicants