# Real-Time Multiplayer Tap Game

A fast-paced, real-time multiplayer tap game built with Angular and Socket.IO. Players compete by rapidly tapping their keyboard keys, and the game tracks scores and declares a winner after a timed round.

---

# Demo

https://drive.google.com/file/d/1yWDdi6nh2YHtQVckEP-zU-iWdx-983QF/view?usp=drive_link

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Folder Structure](#folder-structure)
- [How to Play](#how-to-play)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- Real-time multiplayer gameplay using WebSockets (Socket.IO)
- Player management with join/leave notifications
- Countdown timer before the game starts
- 15-second timed game rounds with live tap counts
- Prevents key hold; requires finger lift between taps
- Real-time winner announcement displayed on the game UI
- Clean Angular frontend with reactive UI updates
- Simple and scalable Node.js backend with Socket.IO for real-time events

---

## Tech Stack

- **Frontend**: Angular 15+, TypeScript, Socket.IO client
- **Backend**: Node.js, Express, Socket.IO server
- **Communication**: WebSockets via Socket.IO
- **Development**: npm, Angular CLI

---

## Setup and Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm (Node package manager)
- Angular CLI (`npm install -g @angular/cli`)

  
- **Clone the repository**

   ```bash
   git clone https://github.com/OmarAyman85/UdinTask/tree/main/Task_3
   ```


### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd server
   ````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   nodemon index.js
   ```

4. The server will run on `http://localhost:3000`.

---

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd spacePusher
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Angular development server:

   ```bash
   ng serve
   ```

4. The frontend will be available at `http://localhost:4200`.

### Configuration

- Update the socket URL in `src/environments/environment.ts` to point to your backend server URL (default: `http://localhost:3000`).

```ts
export const environment = {
  production: false,
  socketUrl: "http://localhost:3000",
};
```


## Folder Structure

```

server/                      # Node.js + Socket.IO server
├── game/ 
├      ├── gameManager.js    # Game logic: scoring, winner detection, reset
├      ├── playerManager.js  # Player management: add/remove players
├── socket/ 
├      ├── index.js          # Socket event handlers and game flow control
└── server.js                # Express server setup and Socket.IO integration

/spacePusher/                            # Angular client app
├── src
├    ├──/app
├    ├    ├──/game                        # GameComponent and UI logic
├    ├    ├    ├──/game.component.ts      
├    ├    ├    ├──/game.component.html    
├    ├    ├    ├──/game.component.css     
├    ├    ├──/services                    
├    ├    ├    ├──socket.service.ts       # Socket client implementation
├    ├    ├──/app.component.ts            
├    ├    ├──/app.component.html          
├    ├    ├──/app.component.css           
├    ├    ├──/app.config.ts               
├    ├    ├──/app.routes.ts               
├    ├──/environments
├    ├──index.html
├    ├──main.ts
├    ├──styles.css
└── ... # Other Angular app files and modules
```
---

## How to Play

1. Open the frontend app in your browser.
2. Enter a username and click **Join**.
3. Click **START GAME** to start the game.
4. Wait for the countdown timer.
5. Once the game starts, tap any key rapidly — each tap counts without holding keys!
6. After 15 seconds, the game ends and the winner is displayed.

---

## Future Improvements

- Add user authentication for persistent profiles
- Implement leaderboards and player stats
- Support mobile touch input for tapping
- Add sound effects and animations for enhanced experience
- Deploy backend and frontend to cloud platforms

---

## License

This project is open source under the MIT License.
