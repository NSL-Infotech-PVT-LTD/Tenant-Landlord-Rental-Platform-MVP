## Demo

https://rentalmvp.netscapelabs.com/

```bash
User Name: tenant@netscapelabs.com
Password: 1234567890
```

# Tenant-Landlord Rental Platform MVP 
Tenant-Landlord Rental Platform MVP is a project developed by **NSL Infotech Pvt Ltd**, a subsidiary of Netscape Labs. This innovative application offers cutting-edge features for Tenants to review Landlord properties.

---

## About NSL Infotech Pvt Ltd
NSL Infotech Pvt Ltd is a leading technology company specializing in innovative solutions for various industries. With a focus on excellence and customer satisfaction, we strive to deliver high-quality products and services that meet the evolving needs of our clients.
Visit our website: [Netscape Labs](https://netscapelabs.com/)

---

## Project Structure
The project consists of two main directories:
- `tenant-api`: Backend Node.js Express API
- `tenant-frontend`: Frontend React.js application

---

## Description  
In this project, users can log in as tenants to explore properties listed by different landlords. Tenants can provide reviews for these properties, enhancing transparency and trust.  

We have created multiple users for demo purposes. You can log in with the following credentials:  
- **email:** `tenant@netscapelabs.com` | **password:** `1234567890`  
- **email:** `tenant1@netscapelabs.com` | **password:** `1234567890`  
- **email:** `tenant2@netscapelabs.com` | **password:** `1234567890`  
- **email:** `tenant3@netscapelabs.com` | **password:** `1234567890`  
- **email:** `tenant4@netscapelabs.com` | **password:** `1234567890`  

---

## Backend: tenant-api

### Prerequisites
- Node.js (recommended version 18.x or later)
- MongoDB
- npm (Node Package Manager)

### Installation
1. Navigate to the backend directory
```bash
cd rental-mvp/tenant-api
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env` file in the `tenant-api` directory with the following variables:
- `MODE`: Development or production mode (`dev` or `prod`)
- `PORT`: Server port (e.g., 7006)
- `devUrl`: Local MongoDB connection string
- `prodUrl`: Production MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `ACCESS_KEY`: Cloud storage access key
- `SECRET_KEY`: Cloud storage secret key

### Running the Backend
#### Development Mode
```bash
npm start
```
Uses `nodemon` for automatic server restart during development

#### Production Considerations
- Ensure proper MongoDB connection
- Set `MODE=prod` in the environment variables
- Use a process manager like PM2 for production deployment

---

## Frontend: tenant-frontend


### Prerequisites
- Node.js (recommended version 18.x or later)
- npm (Node Package Manager)
- React.js

### Installation
1. Navigate to the frontend directory
```bash
cd rental-mvp/tenant-frontend
```

2. Install dependencies
```bash
npm install
```

### Running the Frontend
#### Development Mode
```bash
npm start
```
Runs the React development server

#### Production Build
```bash
npm run build
```
Creates an optimized production build

---

## Key Backend Dependencies
- Express.js: Web application framework
- Mongoose: MongoDB object modeling
- AWS SDK: Cloud storage integration
- Cloudinary: Image upload and management
- JSON Web Token (JWT): Authentication
- Bcrypt: Password hashing
- Nodemailer: Email sending functionality

## Key Frontend Dependencies
- React.js: JavaScript library for building user interfaces
- React Router: Routing management
- State management library (Redux/Context API)
- Axios: HTTP client for API requests

## Database
- MongoDB used as the primary database
- Supports both local and cloud-hosted MongoDB instances

## Authentication
- JWT-based authentication
- Secure password hashing with bcrypt

## File Upload
Backend supports multiple storage options:
- Local storage
- AWS S3
- Cloudinary

## Environment Modes
- Development (`MODE=dev`): Uses local MongoDB
- Production (`MODE=prod`): Uses production MongoDB instance

## Security Considerations
- Use strong, unique values for `JWT_SECRET`
- Keep `.env` file private and out of version control
- Rotate access keys periodically

## Recommended Next Steps
- Set up comprehensive error handling
- Implement detailed logging
- Create robust input validation
- Configure CORS settings
- Set up monitoring and performance tracking

![Logo](https://netscapelabs.com/wp-content/themes/netscapelabs/assets/images/footer-logo.png)

## Support
For support, email:- gaurav@netscapelabs.com