# 🛣️ The Nest Trail

A text-based adventure arcade game inspired by *The Oregon Trail*, built with **Express, React, and Node.js (ERN stack)**.

Players take on the role of an intern traveling between NEST centers, collecting resources, overcoming AI-driven random events, and working their way toward HQ.  

[The Nest Trail Game Document](https://docs.google.com/document/d/152v0GMVGut542ITzNfpjr7s40q4v0ZtWRLWtSYlPOWw/edit?tab=t.0)

## 📖 Table of Contents

- [About The Game](#about-the-game)
- [Gameplay Overview](#gameplay-overview)
- [Installation (Developers)](#installation-developers)

## 📜 About The Game

The **NEST Trail** is a modern reimagining of *The Oregon Trail*. Players journey across various NEST centers, managing limited resources like laptops, coffee, gas, and chargers.  

At each center, they collect **McGuffins** (power-ups) and prepare for the next leg of the trip. The goal is to reach HQ with as many resources, McGuffins, and points as possible.

Failure comes quickly if players run out of resources, upset center directors, or fail objectives along the way.

---

## 🎮 Gameplay Overview
1. Start at a random center.  
2. Choose an **Intern class** (Dev, Designer, Video).  
3. Stock up on resources before traveling.  
4. Travel to the next center:
   - AI generates random events.  
   - Player makes choices to manage risks.  
   - Success/failure impacts resources.  
5. Reach the center:
   - Collect a McGuffin.  
   - Restock resources.  
6. Repeat until all centers are visited.  
7. Final trip to HQ = Win condition.  

---

## ⚙️ Installation (Developers)

Step-by-step instructions on how to get the development environment running.

1. Clone the repository:
    ```sh
    git clone https://github.com/BizzNEST/The-Nest-Trail.git
    ```
2. Navigate to the project directory:
    ```sh
    cd The-Nest-Trail
    ```
3. Install dependencies (in both frontend and backend directories):
    ```sh
    npm install
    ```
4. Run the development server:
    ```sh
    npm run dev
    ```

