<img width="1600" height="745" alt="proj1" src="https://github.com/user-attachments/assets/f3e93a57-f735-4c89-b450-9cc84c96f6c1" />
<img width="1600" height="745" alt="proj1" src="https://github.com/user-attachments/assets/663767d0-ce3a-4cab-a114-96d154fe054c" />
<img width="1600" height="745" alt="proj1" src="https://github.com/user-attachments/assets/6f0f9463-a0f0-406e-8cf8-c9537e9d6dcd" />
<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# [PEN FLIP AURA CALCULATOR] 🎯


## Basic Details
### Team Name: [FREEMAN]


### Team Members
- Member 2: [SIDHARTH.S] - [st joseph's college of engineering and technology palai]
- Member 3: [DERICK JAMES] - [st joseph's college of engineering and technology palai]

### Project Description
[PEN FLIP AURA CALCULATOR is a computer-vision-powered web application designed to track and evaluate pen-spinning technique from uploaded videos.

Using frame-by-frame visual tracking (via OpenCV and MediaPipe), it measures kinetic performance metrics such as spin speed (RPM), center-of-rotation accuracy, and wobble stability.

These insights are presented through an interactive results dashboard featuring visual trajectory overlays and motion replay.]

### The Problem (that doesn't exist)
[Unregulated pen-spinning creates off-axis gyroscopic wobble, generating subsonic desk micro-vibrations that subconsciously desynchronize neighboring coworkers' cognitive focus.

Furthermore, unmonitored spin speeds exceeding 400 RPM induce centrifugal ink cavitation, triggering sudden, untraceable ballpoint failure during multi-million-dollar contract signings.

Without sub-millimeter computer-vision calibration, office professionals face an untracked epidemic of dropped pens and catastrophic loss of boardroom authority.]

### The Solution (that nobody asked for)
[the world’s first mission-critical, military-grade computer vision platform dedicated to eliminating off-axis wobble and bringing sub-millimeter kinetic accountability to office stationery.]

## Technical Details
### Technologies/Components Used
For Software:
LANGUAGES
- [Python ,TypeScript (JavaScript),HTML5,CSS3,SQL (SQLite)]
FRAMEWORK
- [frontend,backend,computer vision and math]
LIBRARIES USED
- [OpenCV (opencv-python)
MediaPipe
NumPy
FastAPI
Uvicorn
SQLAlchemy
Pydantic
Lucide React
React
React DOM
python-multipart
aiofiles
HTTPX
Pytest
pytest-asyncio
Oxlint]
TOOLS USED
- [Vite
TypeScript Compiler (tsc)
Oxlint
SQLite
Node.js
npm
Python venv
pip
Pytest
Git
FFmpeg]

### Implementation
For Software:
# Installation
[commands]

# Run
[commands]

### Project Documentation
For Software:

# Screenshots (Add at least 3)
<img width="1600" height="745" alt="proj1" src="https://github.com/user-attachments/assets/fd81651c-b049-4bfa-9316-d6a635868e8a" />
pen flip aura calculator home screen

<img width="1600" height="762" alt="proj2" src="https://github.com/user-attachments/assets/8c04130b-3058-49a9-ab2d-de28596ba6e1" />
upoading the spinning video

<img width="1600" height="751" alt="proj3" src="https://github.com/user-attachments/assets/d6d37248-073b-4c78-9a08-66bd5d833bb4" />
shows the final output as aura level 

# Diagrams
[ USER / FRONTEND ]
         │
         │  1. Upload Video (.mp4/.mov)
         ▼
[ FASTAPI BACKEND ] ─────────────► [ STORAGE & SQLITE ]
         │                             (Store raw video & record status: "PENDING")
         │  2. Trigger Background Task
         ▼
[ ANALYSIS ENGINE ]
   ├── OpenCV       ──► Frame Extraction & Color/Contour Tracking
   ├── MediaPipe    ──► Hand & Finger Joint Center Detection
   └── NumPy        ──► Angular Velocity, RPM, Center Accuracy & Wobble
         │
         │  3. Save Metrics & Trajectory Data
         ▼
[ SQLITE DATABASE ] (Status: "COMPLETED")
         │
         │  4. Poll / Fetch Results & Trajectory JSON
         ▼
[ RESULTS DASHBOARD ]
   ├── Overall Technique Score (0–100)
   ├── Kinetic Cards (RPM, Wobble %, Center Accuracy)
   └── Interactive Video Replay + Canvas Trajectory Overlay0


### Project Demo

https://github.com/user-attachments/assets/0a4c5e66-6b8d-4d43-bcb8-8233debc16cb
complete working of the pen flip aura calculator



## Team Contributions
- [Sidharth.S]: [Frontend]
- [Derick james]: [Backend]

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



