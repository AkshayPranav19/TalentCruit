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

       const parseInterviewTimestamp = (str) => {
        if (!str || str.trim() === '') {
            return 0; 
        }

        const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2})(?::(\d{2}))?(am|pm)$/i);
        if (!match) return 0; 
        const [, day, month, year, hourRaw, minuteRaw = '0', suffix] = match;
        let hour = parseInt(hourRaw, 10);
        const minute = parseInt(minuteRaw, 10);
        if (suffix.toLowerCase() === 'pm' && hour !== 12) hour += 12;
        if (suffix.toLowerCase() === 'am' && hour === 12) hour = 0;
        const interviewDate = new Date(year, month - 1, day, hour, minute);
        return interviewDate.getTime(); 
      
    };

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
            const scheduled = users.filter(u => u.interviewDate && u.interviewDate.trim() !== '').length
            const upcoming = users
              .filter(u =>
                u.interviewDate?.trim() &&
                parseInterviewTimestamp(u.interviewDate) > Date.now()
              )
              .sort((a, b) =>
                parseInterviewTimestamp(a.interviewDate)
                - parseInterviewTimestamp(b.interviewDate)
              );
            setData({
            totalApplicants: total,
            acceptedApplicants: accepted,
            waitlistApplicants: waitlist,
            rejectedApplicants: rejected,
            scheduledInterviews: scheduled,
            upcomingInterviews: upcoming,
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
        <div>
  <div className='p-2 border border-gray-200 rounded-md max-w-3xl'>
    <h2 className='text-lg font-semibold mb-2'>Upcoming Interviews</h2>
    
    {data.upcomingInterviews.length === 0 ? (
      <p className="text-sm text-gray-600">No upcoming interviews scheduled.</p>
    ) : (
      <table className="w-full text-sm text-left text-gray-800 border-t mt-2">
        <thead>
          <tr>
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Job Role</th>
            <th className="py-2 font-medium">Interview Date</th>
          </tr>
        </thead>
        <tbody>
          {data.upcomingInterviews.map((user, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 pr-4">{user.name}</td>
              <td className="py-2 pr-4">{user.email}</td>
              <td className="py-2 pr-4">{user.job_role}</td>
              <td className="py-2">
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                {user.interviewDate?.trim() || 'Not Scheduled'}
              </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>
        
    </div>
</div>

  )
}

export default Dashboard


