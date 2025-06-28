// Assessment Configuration
export const TOTAL_QUESTIONS = 4;
export const ASSESSMENT_DURATION = 60 * 60; // 1 hour in seconds
export const LANGUAGE = "python";

// API Endpoints
export const API_BASE_URL = "http://localhost:3001";
export const TEST_RUNNER_URL = "http://localhost:5002";

// Score Calculation Weights
export const SCORE_WEIGHTS = {
  ML: 0.2,
  LLM: 0.4,
  CODE: 0.4
};

export const ACCEPTANCE_THRESHOLD = 60;

// Language Templates
export const LANGUAGE_TEMPLATES = {
  1: `def two_sum(nums, target):
    # Write your solution here
    pass`,
  2: `def add_two_numbers(l1, l2):
    # Definition for singly-linked list
    # class ListNode:
    #     def __init__(self, val=0, next=None):
    #         self.val = val
    #         self.next = next
    
    # Write your solution here
    pass`,
  3: `def length_of_longest_substring(s):
    # Write your solution here
    pass`,
  4: `def find_median_sorted_arrays(nums1, nums2):
    # Write your solution here
    pass`
};

// Question Data
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

// Error Messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found in database",
  NETWORK_ERROR: "Could not connect to test server",
  NO_CODE: "Please write some code before running tests.",
  SYNTAX_ERROR: "Syntax Error",
  EXECUTION_ERROR: "Execution Error",
  TIMEOUT_ERROR: "Timeout Error: Code took too long to execute"
};

// UI Text
export const UI_TEXT = {
  COMPLETION_MESSAGE: "Thank you for completing the TalentCruit AI coding assessment. Your solutions have been submitted for review.",
  RESET_CONFIRMATION: "Are you sure you want to reset your code? This action cannot be undone.",
  NO_CODE_TO_TEST: "No code to test."
};