# Full Stack AI Conversation Application

A fullstack application built with Next.js frontend and Express.js backend, powered by Deepgram API for voice processing.

## Project Structure

```
fullstack-ai-conversation/
├── frontend/          # Next.js 16 React application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── public/       # Static assets
└── backend/          # Express.js server
    ├── server.js     # Main server file
    └── package.json  # Backend dependencies
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Deepgram API Key

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory with the following:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

**How to get a Deepgram API Key:**

1. Go to [https://console.deepgram.com](https://console.deepgram.com)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:3001` (or the port specified in your server.js)

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Development

### Running Both Servers

You can run both servers simultaneously by opening two terminal windows:

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend Build:**

```bash
cd frontend
npm run build
npm start
```

**Backend** is already production-ready with `npm start`

## API Communication

The frontend communicates with the backend using WebSockets and HTTP requests.

**Backend Endpoints:**

- All server routes are defined in `backend/server.js`

**Frontend API Client:**

- API communication logic is in the frontend components

## Dependencies

### Backend

- **Express.js** - Web framework
- **ws** - WebSocket support
- **dotenv** - Environment variable management

### Frontend

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
