'use client'
import { Interview } from '@/context/interviewContext';
import axios from 'axios';
import { ArrowLeft, Calendar, Clock, DownloadIcon, FilterIcon, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/interview/UserProfile';

interface ScheduleInterview extends Interview {
    Feedbacks?: [{
        id: number
        interview_id: number
        userName: string
        userEmail: string
        feedback: {
            rating: {
                technicalSkills: number,
                communication: number,
                problemSolving: number,
                experience: number
            },
            summary: string,
            created_at: string
        }
    }]
}

interface UserProfileProps {
    userName: string
    userEmail: string
    feedback: {
        rating: {
            technicalSkills: number,
            communication: number,
            problemSolving: number,
            experience: number
        },
        summary?: string,
        created_at: string
    }
};
const page = () => {
    const { interview_id } = useParams();
    const [interview, setInterview] = React.useState<ScheduleInterview | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 2;
    const [clickedUserProfile, setClickedUserProfile] = useState<UserProfileProps | null>(null);

    useEffect(() => {
        // Fetch interview details from the interview_id using axios
        const fetchInterviewDetails = async () => {
            try {
                const response = await axios.get(`/api/interview/fetch-details/${interview_id}`);
                setInterview(response.data[0]);
                console.log("Fetched interview details:", response.data[0]);
            } catch (error) {
                console.error("Error fetching interview details:", error);
            }
        };

        interview_id && fetchInterviewDetails();
    }, [interview_id]);

    // Flatten all questions from all categories for pagination
    const allQuestions = interview?.questions?.flatMap((categoryItem, categoryIndex) =>
        categoryItem.questions.map((question, questionIndex) => ({
            ...question,
            categoryIndex,
            questionIndex,
            globalIndex: categoryIndex * 1000 + questionIndex // Create unique global index
        }))
    ) || [];

    // Calculate pagination
    const totalPages = Math.ceil(allQuestions.length / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = allQuestions.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='px-5'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <ArrowLeft className='cursor-pointer' onClick={() => { window.history.back() }} />
                    <h1 className='text-xl font-bold'>Interview Details</h1>
                </div>
                <div className='flex items-center space-x-2'>
                    <FilterIcon className='w-5 h-5 text-gray-500' />
                    <DownloadIcon className='w-5 h-5 text-gray-500' />
                </div>
            </div>
            <div className='mt-5 p-5 bg-white rounded-lg'>
                <div className='w-full flex justify-between'>
                    <h2 className='text-lg font-bold'>{interview?.jobPosition}</h2>
                    <p className='bg-green-100 text-green-800 p-1 rounded-lg'>Active</p>
                </div>
                <div className='w-full flex justify-start mt-5'>
                    <div className='w-1/3'>
                        <p className='text-sm text-gray-500'>Duration</p>
                        <div className='flex justify-start items-center my-1'>
                            <Clock className='inline-block w-4 h-4 mr-1' />
                            <span className='text-gray-800 text-sm font-semibold'>{interview?.duration} Min</span>
                        </div>
                    </div>
                    <div className='w-1/3'>
                        <p className='text-sm text-gray-500'>Created On</p>
                        <div className='flex justify-start items-center my-1'>
                            <Calendar className='inline-block w-4 h-4 mr-1' />
                            <span className='text-gray-800 text-sm font-semibold'>{new Date(interview?.created_at!).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className='w-1/3'>
                        <p className='text-sm text-gray-500'>Type</p>
                        <div className='flex justify-start items-center my-1'>
                            <Tag className='inline-block w-4 h-4 mr-1' />
                            <span className='text-gray-800 text-sm font-semibold'>{interview?.types?.join(", ")}</span>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <h2 className='text-md font-semibold'>Job Description</h2>
                    <p className='text-gray-800 my-1'>{interview?.jobDescription}</p>
                </div>

                {/* Paginated Interview Questions Section */}
                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-md font-semibold'>Interview Questions</h2>
                        <div className='text-sm text-gray-600'>
                            Showing {startIndex + 1}-{Math.min(endIndex, allQuestions.length)} of {allQuestions.length} questions
                        </div>
                    </div>

                    {/* Questions List */}
                    <ul className='space-y-6 mb-6'>
                        {currentQuestions.map((item, index) => (
                            <li key={item.globalIndex} className='p-4 border rounded-lg bg-gray-50 shadow-sm'>
                                <div className='flex items-center justify-between'>
                                    <p className='font-semibold text-base text-gray-900'>
                                        Question {startIndex + index + 1}: {item.question}
                                    </p>
                                    <div className='flex items-center space-x-2'>
                                        <span className='text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full'>
                                            Difficulty: <span className='font-medium text-gray-800'>{item.difficulty}</span>
                                        </span>
                                        <span className='text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full'>
                                            Type: <span className='font-medium text-gray-800'>{item.type}</span>
                                        </span>
                                    </div>
                                </div>

                                {item.evaluation_criteria && (
                                    <p className='mt-2 text-sm text-gray-600'>
                                        <span className='font-medium'>Evaluation Criteria:</span> {item.evaluation_criteria}
                                    </p>
                                )}
                                {item.ai_evaluation_hints && (
                                    <p className='mt-1 text-sm text-gray-600'>
                                        <span className='font-medium'>AI Evaluation Hints:</span> {item.ai_evaluation_hints}
                                    </p>
                                )}

                                {/* Render Follow-up Questions */}
                                {item.follow_ups && item.follow_ups.length > 0 && (
                                    <div className='mt-4 pl-4 border-l-2 border-gray-200'>
                                        <p className='font-semibold text-sm text-gray-700'>Follow-up Questions:</p>
                                        <ul className='list-none space-y-2 mt-2'>
                                            {item.follow_ups.map((followUp, followUpIndex) => (
                                                <li key={followUpIndex} className='text-sm text-gray-800'>
                                                    <p className='font-normal'>- {followUp}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className='border-t pt-4'>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={handlePrevious}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => handlePageChange(page)}
                                                isActive={currentPage === page}
                                                className='cursor-pointer'
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={handleNext}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
            <div className='mt-8 p-4 '>
                <h3 className='text-md font-semibold mb-2'>Candidates</h3>
                {
                    interview?.Feedbacks?.map((item, index) => (
                        <div key={index} className='w-full flex justify-between p-3 bg-white rounded-lg my-2'>
                            <div className='flex items-center space-x-2 '>
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="text-xl">AI</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className='text-md font-semibold'>{item.userName}</h3>
                                </div>
                            </div>
                            <div className='flex items-center justify-between space-x-2 bg-white rounded-lg mt-3'>
                                <p className='text-green-600 text-sm font-semibold mr-3'>Marks {item.feedback.rating.communication + item.feedback.rating.experience + item.feedback.rating.problemSolving + item.feedback.rating.technicalSkills}/40</p>
                                <UserProfile userName={clickedUserProfile?.userName} userEmail={clickedUserProfile?.userEmail} feedback={clickedUserProfile?.feedback} onClick={() => { console.log("setting item : ", item); setClickedUserProfile(item); }} />
                            </div>
                        </div>
                    ))

                }
            </div>
        </div>
    )
}

export default page