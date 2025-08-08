# World Time & Travel Dashboard

Https://glancego.com

This is a web application that allows users to click anywhere on a world map and view a dashboard of information for that location. It's designed as a tool for travelers to provide them time for a given location, weather, local news, and more.

## Core Features

This application is built with the following features:

- **Interactive World Map:** A world map (using Leaflet and Stadia Maps) that users can click on to select any location.
- **Dynamic Day/Night Theme:** The map and UI theme t transition between a light and dark mode based on the sunrise/sunset times of the location
- **Location Dashboard:**
  - **Local Time:** A live clock showing the current local time.
  - **Date & Timezone Info:** Displays the full date, timezone name, abbreviation, and UTC offset.
  - **Current Weather & 5-Day Forecast:** Shows the current temperature, an icon describing the weather, and a 5-day weather forecast.
  - **Sunrise & Sunset Times:** display of the local sunrise and sunset times.
  - **Local News Headlines:** A modal window that fetches the top 5 local-language news headlines for the selected country.
- **Favorites & Recents:**
  - **Favorites:** users can star any location to save it as a favorite
  - **Recent Locations:** The app keeps a list of the 5 most recently viewed locations
- **User Experience:**
  - **Animations & Transitions:** Some animations to make it smooth.
  - **Feedback States:**  loading spinners and error messages for all API interaction.

## Upcoming features
- **Forex currency converter**
- **View holiday info for a given country**
- **Rain effect if its raining currently in a given location**




## Tech Stack

- **Frontend Framework:** [Vue 3](https://vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapping:** [Leaflet.js](https://leafletjs.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)

### APIs Used

This project uses some free public APIs:

- **Maps:** [Stadia Maps](https://stadiamaps.com/) & [Esri](https://www.esri.com/) (for map tiles)
- **Geocoding:** [Nominatim (OpenStreetMap)](https://nominatim.org/)
- **Timezone:** [TimeZoneDB](https://timezonedb.com/)
- **Sunrise/Sunset:** [Sunrise-Sunset.org API](https://sunrise-sunset.org/api)
- **Weather:** [OpenWeatherMap](https://openweathermap.org/api)
- **News:** [GNews.io](https://gnews.io/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or your preferred package manager

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/FaalFlew/Glance-Go
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your API keys.

    ```
    VITE_TIMEZONEDB_API_KEY=YOUR_KEY
    VITE_OPENWEATHER_API_KEY=YOUR_KEY
    VITE_GNEWS_API_TOKEN=YOUR_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`
