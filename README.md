# AutoCore Website

This is the frontend for the AutoCore website, built with Next.js and TypeScript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/autocorewebsite.git
    cd autocorewebsite
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

## Environment Variables

The project uses environment variables to configure the API endpoint. This is managed via the `.env.local` file, which is not committed to version control.

1.  Create a local environment file by copying the example:
    ```sh
    cp .env.example .env.local
    ```

2.  Open `.env.local` and modify the variables as needed for your local setup.
    -   `NEXT_PUBLIC_API_URL`: The base URL for the API.
        -   For local development, this is typically `http://168.231.101.119:4000/api/v1`.
        -   For production, this will be set on your hosting provider to the live API endpoint.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.<br />
Open http://localhost:3000 to view it in the browser.

### `npm run build`

Builds the app for production to the `.next` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the production server after building the application with `npm run build`.