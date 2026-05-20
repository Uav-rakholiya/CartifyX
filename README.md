CartifyX

This is the codebase for CartifyX, a full-stack e-commerce project I built. It handles the entire shopping flow from browsing products to secure checkout and order tracking.

Tech Stack
Frontend: Angular 17, Tailwind CSS, Angular Material
Backend: Node.js, Express, MongoDB
Auth: Firebase
Payments: Razorpay
Extras: PDFKit for generating invoices, Nodemailer for sending emails

How to run it locally

You will need Node.js and MongoDB installed on your machine.

1. Setup the backend
Navigate to the backend folder and run npm install
Create your own .env file. You can copy the provided .env.example and fill in your own Firebase config and Razorpay keys (I removed mine before pushing this repo).
Start the server with npm run dev (it runs on port 5003)

2. Setup the frontend
Open a new terminal and go to the frontend folder
Run npm install
Start the app with npm start (it runs on port 4200)

That is pretty much it. Feel free to poke around the code.
