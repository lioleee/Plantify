# 🌿 Plantify – Plant Care & Marketplace App

**Plantify** is a mobile application designed to make plant care easier and more convenient. It allows users to manage their personal plant collections, track watering schedules, monitor plant health, and explore a plant marketplace.

The project is developed using React Native, Expo, Node.js, Express.js, and MySQL, with AI-assisted development and iterative debugging.

## ✨ Features

- **User Authentication:** Registration, login, input validation, and JWT-based backend authentication.
- **My Jungle:** Manage personal plants and monitor their health conditions.
- **Watering Management:** Track watering schedules and mark plants as watered.
- **Plant Marketplace:** Browse plants, explore categories, and search for plants.
- **Shopping Cart:** Add or remove products and manage quantities.
- **Checkout:** Cart calculations, checkout form, and simulated payment confirmation.
- **Notifications:** Interactive watering reminder notifications.
- **Backend Integration:** REST APIs for authentication and plant management.

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React Native | Mobile application |
| Expo | Development environment |
| JavaScript | Frontend and backend programming |
| Node.js | Backend runtime |
| Express.js | REST API |
| MySQL | Database |
| bcryptjs | Password hashing |
| JWT | Authentication |
| Git & GitHub | Version control |

## 📂 Project Structure

```text
Plantify/
│
├── frontend/
│   ├── assets/
│   ├── App.js
│   ├── app.json
│   ├── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── plantRoutes.js
│   ├── server.js
│   └── package.json
│
├── README.md
├── AGENTS.md
├── prompt_log.md
└── LICENSE
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js and npm
- MySQL Server
- Visual Studio Code
- Expo Go (for mobile testing)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Plantify
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code using Expo Go to run the application on your mobile device.

To run in a browser:

```bash
npx expo start --web
```

### 3. Set Up the Backend

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=plantify
DB_PORT=3306
JWT_SECRET=your_secret_key
```

Create the database in MySQL:

```sql
CREATE DATABASE plantify;
```

Create the required `users` and `plants` tables according to the database queries in the backend routes.

### 5. Start the Backend

Inside the backend folder, run:

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

To check the server:

```text
http://localhost:5000/
```

To check database connectivity:

```text
http://localhost:5000/test-db
```

### 6. Connect Frontend to Backend

Update the `API_BASE_URL` in `App.js` with your backend address.

For a physical mobile device, use your computer's local IP address instead of `localhost`.

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | User login |
| GET | `/api/plants` | Retrieve plants |
| POST | `/api/plants` | Add a plant |
| PUT | `/api/plants/:id` | Update a plant |
| DELETE | `/api/plants/:id` | Delete a plant |

Plant management endpoints require authentication.

## 🤖 AI-Assisted Development

AI tools were used to support the development process, including:

- Generating application components and layouts.
- Improving UI and navigation.
- Implementing application features.
- Identifying and fixing coding errors.
- Improving form validation and functionality.
- Testing and refining AI-generated code.

AI-generated outputs were reviewed and refined through iterative prompting and debugging.

**Development Documentation:**
- [Prompt Log](prompt_log.md) – Prompts, identified issues, and improvements.
- [AGENTS.md](AGENTS.md) – AI coding guidelines and project instructions.

## 🔮 Future Enhancements

- Real email OTP verification.
- Online payment gateway integration.
- AI-based plant disease detection.
- Automated watering reminders.
- Weather-based plant care suggestions.
- Enhanced user profiles and order management.

## 📌 Project Information

| Detail | Description |
|---|---|
| Project | Plantify |
| Category | Mobile Application |
| Domain | Plant Care & E-Commerce |
| Architecture | Frontend + Backend |
| Development | AI-Assisted Development |

## 📄 License

This project is distributed under the license provided in this repository.

---

**Plantify – Grow Better, Live Greener. 🌱**
