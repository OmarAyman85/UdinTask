---

# UdinTask Sokoban - Angular Firebase Multiplayer Game

A real-time, multiplayer Sokoban game project built with Angular frontend and Firebase backend.
Features include user authentication, role-based registration, live leaderboard, protected routes, and a clean, semantic UI.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Authentication Flow](#authentication-flow)
- [Route Protection](#route-protection)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is a multiplayer Sokoban game where users can register, login, and compete with others. The dashboard displays the top 10 users by score, and users can navigate to the game only when authenticated. The app handles different user roles such as player and anonymous users with unique username generation.

---

## Features

- **User Registration & Login** with email/password
- **Role-based registration** including anonymous users with auto-generated usernames
- **Firebase Authentication & Firestore** for backend
- **Live Leaderboard** showing top 10 users by score
- **Route Guards** to protect `/dashboard` and `/game` routes from unauthorized access
- **Logout functionality** accessible from dashboard with floating button
- **Semantic and accessible HTML** with responsive styling
- **Clean code architecture** using Angular standalone components and RxJS for async operations

---

## Tech Stack

- **Frontend:** Angular 15+ (Standalone Components)
- **Backend:** Firebase Authentication & Firestore
- **State Management:** RxJS, Angular Services
- **Styling:** CSS with semantic, accessible markup
- **Routing:** Angular Router with Route Guards

---

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/udin-task-sokoban.git
   cd udin-task-sokoban
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password) and **Firestore Database**
   - Copy your Firebase config and update the environment file `src/environments/environment.ts`

4. **Run the development server**

   ```bash
   ng serve
   ```

5. **Open your browser**

   Navigate to `http://localhost:4200`

---

## Running the App

- Visit `/register` to create an account (choose role `player` or `anonymous`)
- Login via `/login`
- After successful login, you will be redirected to `/dashboard` showing your username and leaderboard
- Click **LET’S PLAY** to navigate to the game page
- Logout using the button on the dashboard

---

## Folder Structure

```
src/
 └── app/
     ├── auth/                # Authentication services, guards, login/register components
     ├── dashboard/           # Dashboard component showing leaderboard and user info
     ├── game/                # Game components and logic
     ├── services/            # Shared services (AuthService, UserService)
     ├── app-routing.module.ts # Route definitions with guards applied
     └── app.component.ts     # Root component
```

---

## Authentication Flow

- **RegisterComponent** handles user signup with role support
- If role is `anonymous`, username is auto-generated with a unique number fetched from backend
- **LoginComponent** handles user login
- **AuthService** interfaces with Firebase Auth and Firestore to register, login, fetch user data, and get leaderboard
- **DashboardComponent** subscribes to auth state and displays current user and top 10 leaderboard

---

## Route Protection

- `AuthGuard` protects routes like `/dashboard` and `/game`
- Only authenticated users can access these routes
- Unauthenticated users are redirected to `/login`

---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/yourusername/udin-task-sokoban/issues).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
