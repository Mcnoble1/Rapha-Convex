# Rapha
Centralized Healthcare Platform 

The inspiration behind Rapha came from recognizing the need for a more efficient and accessible healthcare system. We observed the challenges people face in accessing timely medical consultations and managing their health records. Rapha aims to bridge these gaps by providing a seamless platform for connecting patients with medical practitioners and offering a comprehensive electronic health record system.

## Demo Video
https://github.com/Mcnoble1/Rapha-Convex/assets/40045755/394853d6-b121-4bf0-9f71-7782b1350054



## What it does
Rapha serves as a comprehensive healthcare platform that connects users with medical practitioners for consultations. It offers an electronic health record system where verified doctors can securely access and update patient records. Additionally, Rapha features a personal healthcare AI assistant, RaphaAI, to provide users with personalized health insights and assistance.

## How we built it
- ReactJS for the User Interface
- Convex for the backend
- Clerk for user identity and authentication
- Convex for secure data storage,
- OpenAI for Rapha chat assistant

## Installation

You'll need to install Node.js >=v14.16+ (Recommended Version) (NPM comes along with it) and **Vite** for frontend tooling, to perform installation and building production version, please follow these steps from below:

- Use the terminal and navigate to the project Rapha root.

- create a .env file with the details of your convex deployment url

- Then run : <code>npm install</code>

- Then run : <code>npx convex dev</code>

Now, in the browser go to <code>localhost:5173</code>

Navigate to <code>localhost:5173/admin/dashboard</code> to enter the admin dashboard to view registered doctors and issue verifiable credentials


**For Production Build**
Run : <code>npm run build</code>

Default build output directory: /dist

This command will generate a dist as build folder in the root of your template that you can upload to your server.

![conv](https://github.com/Mcnoble1/Rapha-Convex/assets/40045755/62868231-f7dc-48ae-8cf6-bf918cb7602d)

<img width="536" alt="zero" src="https://github.com/Mcnoble1/Rapha-Convex/assets/40045755/8b8e8f66-aebd-49db-9eb5-d2f8728a97cd">


