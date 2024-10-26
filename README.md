# Gotcha Game

A real-time social deduction party game where players try to complete secret tasks without getting caught.

## Features

- Real-time multiplayer gameplay
- Secret task assignment system
- Point-based scoring system
- Live leaderboard
- Mobile-responsive design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Deployment: Railway

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Start the development server:
   ```bash
   # Start the backend server
   cd server && npm run dev
   
   # In another terminal, start the frontend
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SOCKET_URL=your_railway_backend_url
```

## License

MIT