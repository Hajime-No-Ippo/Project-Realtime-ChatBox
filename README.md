[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/erictao)
# Chatbox – Localhost Real-Time Chat Application

A minimal real-time online chatbox built with Node.js and Socket.IO, intended for local use.  
Users can connect in multiple browser tabs to exchange messages in real time via WebSockets.


Congrats! My website had successfully deployed on Koyeb(Which is a deploy platform have supported on WebSocket), and waiting to do more enhance on the function.
You can access simply by clicking the link below. :)


Click here to get on Online Version: [grateful-francene-maynoothuniversity-7d5783cc.koyeb.app/](https://grateful-francene-maynoothuniversity-7d5783cc.koyeb.app/)
<img width="1612" height="920" alt="Image" src="https://github.com/user-attachments/assets/62690372-f291-4e2a-a79f-b5ed7ccda837" />



## Table of Contents  
- [Features](#features)  
- [Technologies](#technologies)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation & Running](#installation-running)  
- [Project Structure](#project-structure)  
- [Usage](#usage)  
- [Configuration](#configuration)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

## Features  
- Real-time bidirectional communication between server and clients
- Simple chat interface served via local HTTP server  
- Easily testable by opening multiple tabs/windows locally  
- Lightweight and minimal dependency footprint

## Use Steps  

<p align="center">
 <img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/ff63a810-ab20-43f6-8266-36172bd245df" />
</p>
<p align="center">
  <sub>
    <span style="color:#8b949e;">
      <em>
      1.Enter the website and you can find a place for entering your username.
      </em>
    </span>
  </sub>
</p>

<p align="center">
 <img width="800" height="700" alt="Image" src="https://github.com/user-attachments/assets/cd06ad70-cda8-4c2c-8aa4-740ffae7ee29" />
</p>

<p align="center">
  <sub>
    <span style="color:#8b949e;">
      <em>
      2.Enter your name and you can get connected into the chat room.
      </em>
    </span>
  </sub>
</p>

## Technologies  
- [Node.js](https://nodejs.org/) – JavaScript runtime  
- Express – web server  
- Socket.IO – real-time WebSocket library  
- React + Vite – frontend app  
- Tailwind CSS + shadcn/ui – UI components and styling

## Getting Started  

### Handshake Logic diagram
<img width="1888" height="3252" alt="Image" src="https://github.com/user-attachments/assets/f43294f0-faa9-4839-add4-1a2539f9a1b2" />

### Prerequisites  
You’ll need:  
- Node.js (v14 or later, v20 as a stable version will be recommended)  
- npm (Node Package Manager)  

### Installation & Running  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/Hajime-No-Ippo/-----Project-Realtime-ChatBox-----
   cd ./realtime-chatbox/

2.Install all dependencies
   ```bash
   npm install
   ```
3. Install client dependencies
   ```bash
   npm --prefix client install
   ```
4. Running the code in your terminal (two terminals)
   ```bash
   npm run dev:server
   npm run dev:client
   ```
5. Open the app
   ```bash
   http://localhost:5173/
   ```

### Production build
```bash
npm run build
npm start
```
## Project-Structure  
```
 ├── server.js          ← Express + Socket.IO server
 ├── client/            ← Vite + React frontend
 │   ├── src/
 │   ├── index.html
 │   └── vite.config.js
 └── package.json       ← server scripts
```
