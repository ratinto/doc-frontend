# Document Q&A Frontend (React)

This is the React-based frontend for the Document Q&A Portal. It allows users to register, log in, upload documents, and ask questions about their documents using AI.

## Features

- Register/login with JWT authentication
- Upload and list documents
- Ask questions and display AI answers
- Friendly dashboard
- Integrates with Django REST backend

---

## Requirements

- Node.js 16+
- npm

---

## Local Development Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/ratinto/doc-frontend.git
    cd doc-frontend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set the backend API URL**

    In `src/api.js`, set:
    ```js
    const api = axios.create({
      baseURL: "http://localhost:8000/api/", // or your deployed backend URL
    });
    ```

    For production, set the Render backend URL (e.g., `https://doc-backend-xhh5.onrender.com/api/`).

4. **Run the frontend**
    ```bash
    npm start
    ```
    The app runs at [http://localhost:3000](http://localhost:3000).

---

## Production Deployment (Vercel)

1. **Push code to GitHub (or another Git provider).**
2. **Go to [Vercel](https://vercel.com/) and import your project.**
4. **Deploy!**

---

## Key Files

- `src/api.js` – Axios config for backend API
- `src/AuthContext.js` – Auth context using JWT
- `src/pages/` – Register, Login, Dashboard pages
- `src/App.js` – Routing

---

## Environment Variables

- If using environment variables for API URL:
    - Create a `.env` file:
      ```
      REACT_APP_API_URL=https://doc-backend-xhh5.onrender.com/api/
      ```
    -
---

