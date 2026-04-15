# Everybody's Jim CO-OP

A real-time co-op role-playing web app where players take on the multiple personalities of a character named Jim and decide together what he should do next.

Built with TypeScript, Node.js, SvelteKit, Socket.IO, and HTML Canvas.

## Overview

In Everybody's Jim, one player becomes the **Storyteller** and the others become **Jim's Personalities**.

The Storyteller presents the situation, Jim's current goal, and the consequences of the group's choices. On each turn, the **Dominant Personality** decides what Jim will do next, while the other Personalities vote on whether they support that action.

The result is decided using a custom **fortune wheel** mechanic that combines:
- risk assigned by the Storyteller
- live player voting
- turn-based progression
- real-time synchronization between all players

The game continues until either:
- Jim reaches his goal and wins, or
- Jim dies and the players lose

## Features

- Real-time multiplayer rooms using Socket.IO
- Role-based gameplay with separate Storyteller and Personality flows
- Room creation and joining by code or shareable link
- Session continuity, allowing players to re-enter existing games in their assigned roles
- Typed bi-directional communication between client and server
- Custom HTML Canvas fortune wheel for action resolution
- Live synchronization of players, votes, turn order, and shared game state
- Browser-based online play
- Deployed live on Render

## Gameplay

### Creating or joining a game

From the main page, users can either:
- create a new room
- or join an existing room using a room code and player name

Players can also return to games they are already part of and re-enter in the same role they previously played.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/59a15429-f5e7-40a9-92d2-6fc9fe569d64" />

### Roles

The player who creates the room becomes the **Storyteller**.

All other players join as **Personalities** inside Jim's head and immediately appear on the Storyteller's screen.

Once at least two Personalities have joined, the Storyteller can begin the game.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/85316b68-29ba-44f6-a3e4-43c2b90242b3" />

### The turn structure

The Storyteller describes:
- the current situation
- the group's goal
- what is happening in the story

Then the **Dominant Personality** chooses what Jim will do next.

The Storyteller decides how likely the action is to fail by assigning a number from **0 to 9**:
- `0` means the action cannot fail on its own
- `1` means a 10% failure chance
- `2` means a 20% failure chance
- and so on, up to `9`, which is the highest non-instant failure chance

The Storyteller can also choose to skip the wheel entirely and force an instant success or instant failure.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/3f3ab3d5-9a47-4de7-9455-5e4860242551" />

### The fortune wheel

The action is resolved using a custom fortune wheel with two types of sections:

#### Skull sections
- Colored **red**
- Marked with a **skull icon**
- Each section takes up **10% of the wheel**
- The number of skull sections is determined by the Storyteller based on the action's risk

#### Personality sections
- Represent the players voting on the action
- Initially colored **blue**, meaning the Personality has not voted
- Turn **green** if the Personality votes 👍
- Turn **red** if the Personality votes 👎

After voting is over, the **Dominant Personality** spins the wheel.

If the pointer lands on:
- **green** → the action succeeds
- **blue** → the action succeeds
- **red** → the action fails

<img width="600" alt="image" src="https://github.com/user-attachments/assets/98935f0f-9117-4835-90fe-4280d4f453c8" />
<img width="600" alt="image" src="https://github.com/user-attachments/assets/d95e87b6-3feb-492e-881c-c72725930264" />
<img width="600" alt="image" src="https://github.com/user-attachments/assets/be89465d-2770-4b18-9767-63e269bc596a" />

### Advancing the game

- If the action succeeds, the same Dominant Personality continues, for up to **3 turns**
- If the action fails, the turn moves to the next Personality in the cycle
- The game continues until the group reaches its goal or Jim dies

## Tech Stack

### Frontend
- SvelteKit
- TypeScript
- HTML Canvas

### Backend
- Node.js
- TypeScript
- Socket.IO

### Deployment
- Render

## Architecture

The application uses a real-time client-server model to keep all players synchronized during live sessions.

- The **server** stores room and game state
- The **client** handles the interactive UI, including the fortune wheel and player actions
- **Socket.IO** is used for typed bi-directional communication between client and server
- The game supports reconnecting users into their existing rooms and roles, helping preserve game flow when someone disconnects temporarily

## Live Demo

https://ej-coop.onrender.com/

## Getting Started

### Prerequisites
- Node.js 20
- npm

### Installation

```bash
git clone https://github.com/DvirArazi/Everybodys-Jim-CO-OP
cd Everybodys-Jim-CO-OP
npm install
```

### Run in development

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/
```

### Build

```bash
npm ci && npm run build
```

### Start the server

```bash
npm run start
```
