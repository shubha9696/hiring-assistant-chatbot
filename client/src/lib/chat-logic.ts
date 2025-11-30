import { useState, useEffect, useRef } from "react";

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface CandidateInfo {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  position?: string;
  location?: string;
  techStack: string[];
}

export type ChatStep = 
  | "GREETING"
  | "NAME"
  | "EMAIL"
  | "PHONE"
  | "EXPERIENCE"
  | "POSITION"
  | "LOCATION"
  | "TECH_STACK"
  | "QUESTIONS"
  | "CLOSING";

export const INITIAL_MESSAGE = "Hello! I'm TalentScout AI, your hiring assistant. I'm here to help you with your initial screening. To get started, could you please tell me your full name?";

const QUESTIONS_DB: Record<string, string[]> = {
  python: [
    "Explain the difference between `list` and `tuple` in Python.",
    "What are decorators in Python and how are they used?",
    "How does memory management work in Python?",
    "What is the difference between `deepcopy` and `copy`?"
  ],
  javascript: [
    "What is the difference between `let`, `const`, and `var`?",
    "Explain the concept of closures in JavaScript.",
    "How does the Event Loop work?",
    "What is the difference between `==` and `===`?"
  ],
  react: [
    "What are React Hooks and why do we use them?",
    "Explain the Virtual DOM and how it improves performance.",
    "What is the difference between State and Props?",
    "How do you handle side effects in React components?"
  ],
  sql: [
    "What is the difference between INNER JOIN and LEFT JOIN?",
    "Explain ACID properties in databases.",
    "What is normalization and why is it important?",
    "How do you optimize a slow SQL query?"
  ],
  java: [
    "What is the difference between an Interface and an Abstract Class?",
    "Explain the concept of Polymorphism in Java.",
    "How does Garbage Collection work in Java?",
    "What are the different types of memory areas allocated by JVM?"
  ],
  default: [
    "Can you describe a challenging technical problem you solved recently?",
    "How do you stay updated with the latest technologies?",
    "What is your preferred development methodology (Agile, Scrum, etc.)?",
    "Describe a time you had to debug a complex issue."
  ]
};

export function useChatLogic() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: INITIAL_MESSAGE,
      timestamp: Date.now(),
    },
  ]);
  const [step, setStep] = useState<ChatStep>("NAME");
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({ techStack: [] });
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);

  const addMessage = (role: Role, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const processInput = async (input: string) => {
    addMessage("user", input);
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      let response = "";
      let nextStep = step;

      switch (step) {
        case "NAME":
          setCandidateInfo((prev) => ({ ...prev, name: input }));
          response = `Nice to meet you, ${input}. What is your email address?`;
          nextStep = "EMAIL";
          break;
        case "EMAIL":
          setCandidateInfo((prev) => ({ ...prev, email: input }));
          response = "Got it. What is your phone number?";
          nextStep = "PHONE";
          break;
        case "PHONE":
          setCandidateInfo((prev) => ({ ...prev, phone: input }));
          response = "Thanks. How many years of experience do you have in the tech industry?";
          nextStep = "EXPERIENCE";
          break;
        case "EXPERIENCE":
          setCandidateInfo((prev) => ({ ...prev, experience: input }));
          response = "Impressive. What position(s) are you applying for?";
          nextStep = "POSITION";
          break;
        case "POSITION":
          setCandidateInfo((prev) => ({ ...prev, position: input }));
          response = "And where are you currently located?";
          nextStep = "LOCATION";
          break;
        case "LOCATION":
          setCandidateInfo((prev) => ({ ...prev, location: input }));
          response = "Great. Now, please list your Tech Stack (programming languages, frameworks, tools, etc.) separated by commas.";
          nextStep = "TECH_STACK";
          break;
        case "TECH_STACK":
          const stacks = input.split(",").map((s) => s.trim().toLowerCase());
          setCandidateInfo((prev) => ({ ...prev, techStack: stacks }));
          
          // Generate questions
          const questions: string[] = [];
          stacks.forEach(stack => {
            if (QUESTIONS_DB[stack]) {
              questions.push(...QUESTIONS_DB[stack].slice(0, 2)); // Take top 2 questions per known stack
            }
          });
          
          if (questions.length === 0) {
            questions.push(...QUESTIONS_DB.default);
          }
          
          // Cap at 5 questions
          const finalQuestions = questions.slice(0, 5);
          setQuestionQueue(finalQuestions);
          
          response = `Thank you. Based on your skills, I have a few technical questions for you.\n\nFirst Question: ${finalQuestions[0]}`;
          nextStep = "QUESTIONS";
          break;
        case "QUESTIONS":
          // User answered a question
          if (currentQuestionIndex < questionQueue.length - 1) {
            const nextIdx = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIdx);
            response = `Thank you. Next question:\n\n${questionQueue[nextIdx]}`;
          } else {
            response = "Thank you for answering those questions. That concludes our initial screening. Our recruitment team will review your responses and get back to you shortly. Have a great day!";
            nextStep = "CLOSING";
          }
          break;
        case "CLOSING":
          response = "The session has ended. You can close this window.";
          break;
        default:
          response = "I'm not sure how to proceed. Let's start over.";
          nextStep = "NAME";
      }

      setIsTyping(false);
      addMessage("assistant", response);
      setStep(nextStep);
    }, 1500);
  };

  return {
    messages,
    processInput,
    isTyping,
    candidateInfo,
    step
  };
}
