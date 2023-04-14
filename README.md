Interactive Comments

Interactive Comments is a full-stack web application built with Node.js and MongoDB that allows users to leave comments, edit comments, and upvote/downvote comments. Users can also engage in threaded discussions about the comments.

Features

User Registration and Authentication: Users can register for an account with a unique username and password, and can authenticate themselves to log in and access the commenting features.

Leave Comments: Users can leave comments on the website by providing their name, email, and comment text. Comments are displayed in a chronological order with the latest comments appearing at the top.

Edit and Delete Comments: Users can edit and delete their own comments. Edited comments are labeled with a timestamp to indicate that they have been modified.

Upvote and Downvote Comments: Users can upvote or downvote comments left by other users, and the total vote count is displayed for each comment. However, users cannot upvote or downvote their own comments.

Threaded Discussions: Users can engage in threaded discussions about the comments by replying to specific comments. Replies are displayed indented below the parent comment, allowing for easy navigation and organization of discussions.

Technologies Used

Front-end: React, Redux, Material-UI
Back-end: Node.js, Express.js
Database: MongoDB
Authentication: jwt
Deployment: Vercel
styling: tailwind

Installation

To run the application locally, follow these steps:

Clone the repository from GitHub: git clone https://github.com/username/interactive-comments.git

Install dependencies for both the client and server:
cd interactive-comments/client
npm install
cd ../server
npm install




