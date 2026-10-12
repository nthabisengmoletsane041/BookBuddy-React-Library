# BookBuddy Kids Library — React Assignment

A responsive community library management system . It uses React, React Hooks, React Router, reusable components, controlled forms, validation, and browser localStorage.

## Requirements
- Node.js 18 or newer
- npm
- Visual Studio Code (recommended)



## Demo accounts
- Admin: `ADMIN` / `1234`
- Member: `BB001` / `1234`

## Features
- Dashboard with book titles, available copies, borrowed-copy activity, members, and low-stock warnings (fewer than 2 copies).
- Add, update, delete, search, and genre-filter books; ISBN values must be unique.
- Add stock and record borrowing; the system prevents borrowing more copies than are available.
- View transaction history with date and time.
- Add, update, and delete member accounts; membership IDs must be unique.
- Admin and Librarian roles can manage member accounts. Member role has a read-only member list.
- React Router pages for Dashboard, Books, Transactions, and Members.
- `useState` manages interactive UI/form state. `useEffect` inside `useLocalStorage` saves changes. `useMemo` prepares shared app state.
- `localStorage` retains books, members, and transactions in the same browser on the same device.

## Main files
- `src/main.jsx` — React entry point and BrowserRouter.
- `src/App.jsx` — routes, reusable UI components, pages, forms, and application logic.
- `src/hooks.js` — reusable `useLocalStorage` hook and demo data.
- `src/styles.css` — responsive styling inspired by the original BookBuddy design.
- `index.html` — Vite page entry point.


## Important note
This is a front-end coursework/demo app. The login and passwords are stored locally and are not secure enough for a real library service. Data is browser-specific; clearing browser storage removes saved records. No server/database is connected.
