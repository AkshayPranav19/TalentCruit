import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../assets/assets'

const Questions = () => {

     const [questions, setQuestions] = useState([])

    const fetchQuestion = async () => {
      setQuestions(QUESTIONS);
    };

    useEffect(() => {
      fetchQuestion();
    }, []);

    const getDifficultyColor = (status) => {
        switch (status) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
            }
        };


  return (
<div className='px-3 pt-2 md:px-3 w-full'>
        <h1 className='text-3xl font-semibold text-gray-900 mb-2'>Questions</h1>
        <p className='text-gray-600 text-base'>
    View and modify questions for technical interview
        </p>

        <div className='max-w-3xl w-full rounded-md overflow-hidden border border-gray-200 mt-6'>
            <table className= 'w-full border-collapse text-left text-sm text-gray-900'>
                <thead className='text-gray-600'>
                    <tr>
                        <th className='p-3 font-medium'>Title</th>
                        <th className='p-3 font-medium'>Difficulty</th>
                        <th className='p-3 font-medium'>Actions</th>
                    </tr>
                </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index} className='border-t border-gray-200'>
                                <td className='p-3'>{question.title}</td>
                                <td className='p-3'><span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                                        {question.difficulty}</span>
                                </td>
                                <td className='p-3 text-blue-500 hover:underline cursor-pointer'>View</td>
                            </tr>
                        ))}
                    </tbody>

            </table>

        </div>

        <div className="mt-4">
          <button className="px-4 py-2 bg-[#2994f7] text-white text-sm rounded hover:bg-[#147cdc] transition">
            Add Question</button>
            </div>
    </div>

    

  )
}

export default Questions