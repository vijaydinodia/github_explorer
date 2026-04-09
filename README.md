# 🚀 GitHub Explorer

A modern React application to search GitHub users and explore their repositories with a clean UI, pagination, sorting, and filtering.

## 📌 Features

### 🔍 User Search

* Search GitHub users using GitHub API
* Debounced input (optimized API calls)

### 👤 User Repositories

* View repositories of selected user
* Display repo details:

  * Name
  * Description
  * Stars 
  * Forks 
  * Language

### ⚡ Performance & UX

* Debouncing (reduces API calls)
* Skeleton loading (premium UX)
* Loading / Error / Empty states

### 📊 Sorting & Filtering

* Sort by:

  * Stars ⭐
  * Forks 🍴
* Filter by programming language

### 📄 Pagination

* API-based pagination
* Shows only existing pages (no fake numbers)

### 🎨 UI/UX

* Modern responsive design
* Dark mode support 
* Clean card layout
* Smooth hover effects

---

## 🛠️ Tech Stack

* React (Functional Components)
* React Router DOM
* JavaScript (ES6+)
* CSS (Custom + Responsive)
* GitHub REST API

---

## 📂 Folder Structure

```
src/
│── components/
│   ├── Loader.jsx
│   ├── Error.jsx
│   ├── Repositorie.jsx
│
│── pages/
│   ├── Home.jsx
│   ├── UserRepos.jsx
│
│── Custom_hooks/
│   ├── useDebounce.js
│   ├── useRepos.js
│
│── services/
│   ├── githubApi.js
│
│── css/
│   ├── home.css
│   ├── repo.css
│   ├── controls.css
│   ├── global.css
│
│── App.jsx
│── main.jsx
```

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/github-explorer.git

# Navigate to project
cd github-explorer

# Install dependencies
npm install

# Run project
npm run dev
```

---

## 📡 API Used

* GitHub API:

```
https://api.github.com
```

Endpoints:

* Search users:

```
/search/users?q={query}
```
---

## 🎯 Future Improvements

* 🔥 Infinite scroll
* ⭐ Bookmark repositories (localStorage)
* 📈 Advanced pagination (1 2 3 ... n)
* 🌐 URL-based pagination
* 🎨 UI animations (Framer Motion)

---

## 💬 Learnings

* Handling API calls efficiently using debouncing
* Managing UI states (loading, error, empty)
* Building reusable components
* Implementing real-world pagination

---

## 👨‍💻 Author

**Vijay Dinodia**

* GitHub: https://github.com/vijaydinodia
* 
---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it 🚀
