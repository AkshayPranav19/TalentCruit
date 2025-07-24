import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
const API_URL = 'https://talentcruit.onrender.com'

const Applicants = () => {

    const [applicants, setApplicants] = useState([])
    const [selectedFeedback, setSelectedFeedback] = useState(null)

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
                        <th className='p-3 font-medium'>Job Role</th>
                        <th className='p-3 font-medium'>Resume Submission</th>
                        <th className='p-3 font-medium'>Coding Completed</th>
                        <th className='p-3 font-medium'>Total Score</th>
                        <th className='p-3 font-medium'>Coding Score</th>
                        <th className='p-3 font-medium'>Status</th>
                        <th className='p-3 font-medium'>AI Feedback</th>
                        <th className='p-3 font-medium'>Actions</th>
                        <th className='p-3 font-medium'>Schedule Interview</th>
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