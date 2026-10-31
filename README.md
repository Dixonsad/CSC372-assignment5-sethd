# TVmaze Show Gallery React

This is an application built with React and Vite so users can search for TV shows using the TVmaze API. It automatically loads a default search on page load, displays up to 10 results in a grid, and fetches the main cast for each show. Clicking a show title uses a client-side routing to load a detailed view.

how to run
1. Clone the repository.
2. Run npm install to install dependencies.
3. Run npm run dev to start the local development server.

React concepts used

Components `App.jsx`, `SearchForm.jsx`, `ShowList.jsx`, `ShowCard.jsx`, `ShowDetail.jsx` |
Lists and keys `ShowList.jsx` (mapping shows), `ShowCard.jsx` (mapping cast members) 
State `App.jsx`, `SearchForm.jsx`, `ShowCard.jsx`, `ShowDetail.jsx` 
Effects and fetch `App.jsx` (initial search fetch), `ShowCard.jsx` (cast fetch) 
Routing `App.jsx` (BrowserRouter, Routes), `ShowDetail.jsx` (`useParams`) 

reflection
Building this in React was honestly a lot easier in some ways than the vanilla JavaScript version, but harder to wrap my head around at first. The hardest part was getting used to passing data around with props instead of just selecting elements, and figuring out the useEffect dependency arrays so it didn't infinitely fetch. 

The easiest part was definitely updating the UI. Instead of writing lines and manually appending things like in Assignment 4, React just automatically updates the screen whenever the state changes. I kept the main state in App.jsx because both the search form and the gallery needed to access or change that data. I kept the cast state local to ShowCard.jsx so each card could manage its own fetch request independently.
