import logo from './logo.png'

export const assets = {
    logo,
}

export const dummyApplicantData = [
{
    "name": "Jackson West",
    "email": "jack@email.com",
    "job_role": "Software Engineer",
    "mlScore": "15",
    "llmScore": "40",
    "codeScore": "100",
    "totalScore": "59",
    "accepted": "waitlist"
},
{
    "name": "Jakobsen",
    "email": "jakob@email.com",
    "job_role": "Software Engineer",
    "mlScore": "15",
    "llmScore": "40",
    "codeScore": "100",
    "totalScore": "59",
    "accepted": "rejected"
},
{
    "name": "James",
    "email": "james@email.com",
    "job_role": "Software Engineer",
    "mlScore": "15",
    "llmScore": "40",
    "codeScore": "100",
    "totalScore": "59",
    "accepted": "accepted"
},
]

export const QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    examples: [
      {
        title: "Example 1:",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        title: "Example 2:",
        input: "nums = [3,2,4], target = 6", 
        output: "[1,2]"
      }
    ]
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "medium",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        title: "Example 1:",
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      },
      {
        title: "Example 2:",
        input: "l1 = [0], l2 = [0]",
        output: "[0]"
      }
    ]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        title: "Example 1:",
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        title: "Example 2:",
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        title: "Example 3:",
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ]
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        title: "Example 1:",
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      },
      {
        title: "Example 2:",
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ]
  }
];