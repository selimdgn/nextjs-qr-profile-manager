# Kisibilgisi.com - Identity & Emergency System

A secure, Next.js-based identity management system designed for storing user profiles, emergency contacts, and medical information, accessible via QR codes.

![Project Preview](public/preview.png)

## Features

-   **Secure User Profiles:** Store vital information like blood type, emergency contacts, and medical notes.
-   **QR Code Integration:** Generate unique QR codes for each user for quick access.
-   **Admin Dashboard:** Comprehensive admin panel to create, edit, and delete users.
-   **Dynamic Backgrounds:** High-end visual effects with moving nebulas and liquid glass UI.
-   **Emergency Contacts:** Add and manage multiple emergency contacts for each user.
-   **Social Media Integration:** Link user profiles to social platforms (Instagram, Twitter, LinkedIn) with clickable cards.
-   **Security:** Role-based access control (Admin/User) and secure authentication.

## Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS + Custom CSS Animations
-   **Database:** SQLite (via `better-sqlite3`)
-   **Authentication:** Custom cookie-based session management

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/kisibilgisi.com.git
    cd kisibilgisi.com
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Default Credentials

The system initializes with a default admin account. **Please change these credentials immediately after first login.**

-   **Username:** `admin`
-   **Password:** `admin123`

## Deployment

This project is optimized for deployment on Vercel or any Node.js hosting provider.

## Credits & Rights

**Documentation & Code Generation:** This project was created entirely with the assistance of Artificial Intelligence.

## License

This project is released under the **Unlicense**.
The author claims **no intellectual property rights**. It is free and unencumbered software released into the public domain.
You are free to use, modify, and distribute it without any restriction.

[View Full License](LICENSE)
