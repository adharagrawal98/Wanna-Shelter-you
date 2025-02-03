Wanna Shelter You 🏠❤️

A Transparent & Secure Donation Platform for Connecting Donors with Shelters

🚀 Overview

Wanna Shelter You is a MERN stack-based donation platform designed to bridge the gap between donors and shelters by ensuring transparency, security, and accessibility in the donation process. Unlike traditional donation platforms, it provides real-time traceability of donations via QR code-based receipts and enhances donor trust with secure transactions and detailed tracking.

With Google Maps API, donors can effortlessly find shelters within a 5 km radius, and role-based access control (RBAC) with Firebase authentication ensures data security and restricted access based on user roles.

🌟 Key Features & Achievements

✅ QR Code-Based Receipts – Every donation generates a unique, traceable QR receipt, allowing donors to verify and track how their funds are being used.

✅ Secure Payment Processing – Integrated PayPal REST API for seamless and secure transactions, ensuring donation integrity.

✅ Google Maps API for Shelter Discovery – Donors can locate nearby shelters within a 5 km radius using an interactive map, making donations more accessible and impactful.

✅ Role-Based Access Control (RBAC) – Implemented Firebase authentication, ensuring different user roles (Donors, Shelter Admins, and Platform Admins) have the appropriate level of access and security.

✅ Real-Time Transparency & Tracking – Donors get clear insights into where their contributions go, making the platform more transparent than traditional donation systems.

✅ Modern & Scalable MERN Stack Architecture – The platform is built using React.js (frontend), Node.js & Express.js (backend), and MongoDB (database), ensuring high performance, scalability, and seamless user experience.

🔥 What Sets Us Apart?

🔹 Enhanced Trust & Transparency – Unlike existing donation platforms, we provide real-time tracking via QR codes, giving donors full visibility into their contributions.

🔹 Seamless Donor Experience – Simplified donation process with interactive shelter discovery, making it easier for donors to contribute meaningfully.

🔹 Improved Security & Authentication – Unlike many platforms with basic login methods, we enforce secure Firebase authentication & role-based access, ensuring only authorized users can access sensitive data.

🔹 Efficient & Scalable – Designed for high scalability, supporting a growing number of shelters and donors without performance bottlenecks.

🛠️ Tech Stack
	•	Frontend: React.js, Tailwind CSS
	•	Backend: Node.js, Express.js
	•	Database: MongoDB
	•	Authentication: Firebase Authentication (Google OAuth, RBAC)
	•	Payments: PayPal REST API
	•	Maps & Location Services: Google Maps API
	•	Deployment: Vercel (Frontend), Render (Backend)

📌 How to Run Locally
	1.	Clone the repository:

git clone https://github.com/adharagrawal98/Wanna-Shelter-You.git
cd Wanna-Shelter-You


	2.	Install dependencies for both frontend and backend:

cd payment-app-fronend-main
npm install --legacy-peer-deps
cd Payment_Backend
npm install


	3.	Set up environment variables in a .env file (example below):
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_API_KEY=your_firebase_api_key


	4.	Start the backend server:

npm run start


	5.	Start the frontend:

npm start


	6.	Open http://localhost:3000 in your browser.

📸 This screenshot is the initial location that the shelter have to fill in while registering.

<img width="530" alt="location" src="https://github.com/user-attachments/assets/71b6d1e6-4660-4eb7-8396-50d3b5c05239" />



📸 The below video snippet shows the process of finding and selecting a shelter nearby within 5 km radius. 

https://github.com/user-attachments/assets/4ce49f37-5af4-41e0-a0ad-7a68bf2763b1


📸 The below screenshot is of the Redeemable QR Code Receipt, that is generated after donation. This is handed over to the homeless for redeeming the shelter.


<img width="234" alt="donation_receipt" src="https://github.com/user-attachments/assets/6113cd7f-dda6-4e9b-ab0f-7f836557a43f" />




📌 Payment Flow & Security

	•	Donations are held securely until the QR code receipt is redeemed by the shelter.
	•	Once the QR code is successfully scanned, the funds are automatically credited to the chosen shelter’s account.
	•	This ensures transparency, accountability, and fraud prevention in the donation process.



📸 The below screenshot shows a successful payment transferred to the shelter’s account, credited only after successful redemption of the QR code.

 
<img width="1207" alt="payment" src="https://github.com/user-attachments/assets/7128c5e6-3e24-4749-ba55-aaf88716e8ba" />

This unique, transparent, and secure donation platform is designed to redefine the way donations work. Join us in making a difference! 🚀💙
