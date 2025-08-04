Professional React Markdown Editor
This is a feature-rich, single-page Markdown editor built with React. It provides a clean, professional, and intuitive interface for writing and previewing Markdown in real-time. The application is designed to be self-contained, with all styles included directly in the component file, which simplifies setup and eliminates the need for complex CSS configurations.

Key Features
Live Preview: Instantly see your rendered HTML as you type.

Syntax Highlighting: Code blocks are beautifully highlighted using highlight.js for enhanced readability.

Multiple View Modes: Seamlessly switch between an editor-only view, a preview-only view, or a split-screen view.

Comprehensive Toolbar: A user-friendly toolbar provides one-click access to common formatting options like headings, bold, italics, lists, links, and more.

Status Bar: Keep track of your document's length with a real-time word and character count.

Self-Contained & Simple: No need to configure Tailwind CSS or other external stylesheets. Everything is included in a single file.

Modern Design: A sleek, dark-themed interface that is both attractive and easy on the eyes.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
You will need to have Node.js and npm (Node Package Manager) installed on your computer.

Installation Guide
Create a New React App with Vite

Open your terminal and run the following command to create a new React project.

npm create vite@latest my-markdown-pro -- --template react

Navigate to the Project Directory

cd my-markdown-pro

Install Dependencies

This project requires two main dependencies: marked for converting Markdown to HTML and lucide-react for the icons.

npm install marked lucide-react

Replace the Application Code

In your code editor, open the src/App.jsx file.

Delete all the existing content in the file.

Copy the entire code from the "Professional React Markdown Editor (Self-Contained)" canvas and paste it into the empty App.jsx file.

Clean Up the CSS

Open the src/index.css file.

Delete all the content inside it. This is important because all the necessary styles are already included within the App.jsx component.

Running the Application
Start the Development Server

In your terminal, run the following command:

npm run dev

View Your Editor

Open your web browser and go to the local URL provided in your terminal (it's usually http://localhost:5173). You should now see your professional Markdown editor in action!
