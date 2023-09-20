# Chlebbit - A Reddit Clone

Chlebbit is a Reddit clone, where users can engage in discussions, share content, and connect with others in a community-driven platform. The name "Chlebbit" is a playful combination of "chleb," which means bread in Polish, and "Reddit."

This project is built using a stack of modern web technologies, including Next.js 13, React, TypeScript, Tailwind CSS, Shadcn-UI, Prisma, Postgres, Redis, and NextAuth for authentication.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

Chlebbit offers a range of features that allow users to:

- Create and join communities
- Post links, text, and media
- Comment and vote on posts
- Upvote and downvote content
- User authentication and authorization
- Real-time updates using WebSockets
- Responsive design for mobile and desktop

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chlebbit.git
   ```

2. Change into the project directory:

   ```bash
   cd chlebbit
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the environment variables:

   ```env
   DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/chlebbit
   REDIS_URL=redis://localhost:6379
   ```

   Update the database and Redis connection details as needed.

5. Run the database migrations:

   ```bash
   npm run prisma:apply
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

The Chlebbit application should now be running locally. Open your browser and navigate to `http://localhost:3000` to access it.

## Usage

To use Chlebbit, you can:

- Create an account or log in using NextAuth authentication.
- Browse and join existing communities.
- Create your own communities.
- Post links, text, and media to communities.
- Comment on and vote on posts.
- Upvote and downvote content to participate in community discussions.

Feel free to explore and engage with the platform as both a regular user and an administrator if needed.
