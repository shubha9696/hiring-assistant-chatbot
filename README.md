# TalentScout AI Hiring Assistant Chatbot

## Project Overview

This project implements an intelligent Hiring Assistant chatbot for "TalentScout," a fictional recruitment agency specializing in technology placements. The chatbot assists in the initial screening of candidates by gathering essential information and posing relevant technical questions based on the candidate's declared tech stack.

## Installation Instructions

1.  Clone the repository: `git clone <repository_url>`
2.  Navigate to the project directory: `cd <project_directory>`
3.  Install the dependencies: `npm install`
4.  Run the client: `npm run dev:client`
5.  Run the server: `npm run dev` (in a separate terminal)

## Usage Guide

1.  Open the client in your browser: `http://localhost:5000`
2.  Interact with the chatbot to simulate a candidate interview.

## Technical Details

*   **Frontend:** React, Vite, TypeScript, Radix UI
*   **Backend:** Node.js, Express, TypeScript, Drizzle ORM, SQLite
*   **Database:** SQLite
*   **Libraries Used:** See `package.json` for a complete list of dependencies.

## Prompt Design

The prompts are designed to:

*   Gather initial candidate information (name, contact information, years of experience, desired positions).
*   Generate technical questions based on the candidate's specified tech stack (e.g., programming languages, frameworks, tools).
*   Ensure coherent and context-aware interactions.

## Challenges & Solutions

*   **Challenge:** Setting up the development environment on Windows.
    *   **Solution:** Used the `SET` command to set the `NODE_ENV` environment variable.
*   **Challenge:** Configuring the database connection.
    *   **Solution:** Switched to a local SQLite database for easier setup.