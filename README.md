📊 Excel Analytics Platform:

A powerful web-based platform to upload and analyze Excel files (.xls, .xlsx), visualize data with interactive 2D and 3D charts, and optionally get smart AI-powered insights.

🚀 Features:

📁 Upload Excel files (.xls or .xlsx)

📊 Select X and Y axes dynamically

📈 Generate interactive 2D and 3D charts (Line, Bar, Pie, etc.)

💾 Download charts as images or PDFs

📜 Track upload history and analysis

🧑‍💻 User authentication and dashboard

🔒 Admin dashboard to manage users and usage


🛠️ Tech Stack

Frontend:

React.js

Tailwind CSS

Redux Toolkit

Chart.js & Three.js

Framer Motion

MUI Icons (optional)

Backend:

Node.js

Express.js

MongoDB (Atlas)

Multer (for file uploads)

SheetJS (xlsx) for Excel parsing

JWT for authentication


Optional Integrations:

OpenAI or Gemini APIs for insights

Cloudinary (for file storage if needed)

File Upload

Chart Generation

AI Insights

User Dashboard

Admin Panel


📦 Installation

1. Clone the repo:
git clone https://github.com/your-username/excel-analytics-platform.git

cd excel-analytics-platform

3. Set up the backend:
cd backend

npm install

Create a .env file with:

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

PORT=5000

OPENAI_API_KEY=your_api_key   # optional

Start the server:

npm start

3. Set up the frontend:
cd ../frontend

npm install

npm run dev

🔐 Authentication

JWT-based login/register

Role-based access (User, Admin)

Google OAuth integration (optional)

✨ AI Insight Feature (Optional)

Upload an Excel file

Get a summary, trends, or insights using AI APIs

Powered by OpenAI or Gemini (via serverless function or backend endpoint)

📁 Folder Structure

📦 excel-analytics-platform

├── backend

│   ├── controllers

│   ├── routes

│   ├── models

│   └── ...

├── frontend

│   ├── components

│   ├── pages

│   ├── redux

│   └── ...


🔗 Live Demo
🌐 Frontend: https://excel-analytics-platform-theta.vercel.app/
🌐 Backend: https://excel-analytics-platform-backend-pozh.onrender.com/

🧪 Try It Out
Upload .xls/.xlsx files
Select chart axes
Generate 2D/3D charts
AI insights 
Admin/User dashboards

🧪 Demo Login:
Email: hello@gmail.com
Password: 123@123

📣 Deployment Details
Frontend: Deployed on Vercel
Backend: Deployed on Render


🙌 Contributing

Pull requests are welcome! Please fork the repo and submit PRs.

📄 License

MIT License

