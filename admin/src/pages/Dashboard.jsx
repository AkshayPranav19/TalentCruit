import React, { useState, useEffect } from 'react'

const API_URL = 'https://talentcruit.onrender.com'
const Dashboard = () => {
    
     const [data, setData] = useState({
         totalApplicants: 0,
         acceptedApplicants: 0,
         waitlistApplicants: 0,
         rejectedApplicants: 0,
         scheduledInterviews: 0,
         upcomingInterviews: [],
     })


    useEffect(() => {
        const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/get-all-users`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const users = await res.json()

            const total    = users.length
            const accepted = users.filter(u => u.accepted === 'accepted').length
            const waitlist = users.filter(u => u.accepted === 'waitlist').length
            const rejected = users.filter(u => u.accepted === 'rejected').length
            setData({
            totalApplicants: total,
            acceptedApplicants: accepted,
            waitlistApplicants: waitlist,
            rejectedApplicants: rejected,
            scheduledInterviews: 0,      
            upcomingInterviews: [],      
            })
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err)
        }
        }

        fetchStats()
    }, [])


     const dashboardCards = [
         {title: "Total Applicants", value: data.totalApplicants},
         {title: "Accepted Applicants", value: data.acceptedApplicants, color: 'bg-green-100'},
         {title: "Waitlist Applicants", value: data.waitlistApplicants, color: 'bg-amber-100'},
         {title: "Rejected Applicants", value: data.rejectedApplicants, color: 'bg-red-100'},
         {title: "Scheduled Interviews", value: data.scheduledInterviews, color: 'bg-blue-100'}
     ]


  return (
    <div className='px-3 pt-2 md:px-3 flex-1'>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-base">
    View a summary of application statistics and upcoming interviews
    </p>

    <div className='grid lg:grid-cols-5 gap-6 my-8 max-w-3xl'>
        {dashboardCards.map((card, index)=>(
            <div key={index} className={`flex gap-2 items-center justify-between p-4 rounded-md border border-gray-200 ${card.color}`}>
                <div>
                    <h2 className='text-xs text-black'>{card.title}</h2>
                    <p className='text-lg text-black font-semibold'>{card.value}</p>
                </div>
        </div>         
        ))}
    </div>

    <div>
        <div className='p-2 border border-gray-200 rounded-md max-w-3xl'>
            <h2>Upcoming Interviews</h2>
        </div>
        
    </div>
</div>

  )
}

export default Dashboard