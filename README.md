# Checklist Management System - Project Structure

## Project Overview
This is a comprehensive Checklist Management System built with Laravel (backend) and React (frontend) with MySQL database.

```
Project1/
├── backend/                 # Laravel API backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Policies/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Patient.php
│   │   │   ├── Checklist.php
│   │   │   ├── ChecklistTemplate.php
│   │   │   ├── ChecklistField.php
│   │   │   ├── ChecklistResponse.php
│   │   │   └── AuditLog.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   ├── composer.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DoctorLayout.jsx
│   │   │   └── DynamicChecklistForm.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── ManageDoctors.jsx
│   │   │   ├── ManagePatients.jsx
│   │   │   ├── ManageChecklists.jsx
│   │   │   ├── CreateChecklistTemplate.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .netlify.toml
│   ├── .gitignore
│
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- MySQL 8.0+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your database credentials:**
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=checklist_management
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. **Install dependencies:**
   ```bash
   composer install
   ```

5. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

6. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

7. **Start the development server:**
   ```bash
   php artisan serve
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Using Docker (Optional)

1. **From project root, start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations in Docker:**
   ```bash
   docker-compose exec backend php artisan migrate
   ```

3. Access:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### Users (Admin only)
- `GET /api/users` - List doctors
- `POST /api/users` - Create doctor
- `GET /api/users/{id}` - Get doctor details
- `PUT /api/users/{id}` - Update doctor
- `DELETE /api/users/{id}` - Delete doctor
- `POST /api/users/{id}/change-password` - Change password

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Checklist Templates (Admin only)
- `GET /api/checklist-templates` - List templates
- `POST /api/checklist-templates` - Create template
- `GET /api/checklist-templates/{id}` - Get template details
- `PUT /api/checklist-templates/{id}` - Update template
- `DELETE /api/checklist-templates/{id}` - Delete template

### Checklists
- `GET /api/checklists` - List checklists
- `POST /api/checklists` - Create checklist
- `GET /api/checklists/{id}` - Get checklist details
- `PUT /api/checklists/{id}` - Update checklist
- `DELETE /api/checklists/{id}` - Delete checklist (Admin only)
- `POST /api/checklists/{id}/submit-responses` - Submit responses
- `POST /api/checklists/{id}/complete` - Complete checklist

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/doctor` - Doctor dashboard data

### Reports
- `GET /api/reports` - Get reports
- `GET /api/reports/export-pdf` - Export to PDF
- `GET /api/reports/export-excel` - Export to Excel

## Features

### Admin Panel
- ✅ Authentication with email/password
- ✅ Manage doctors (create, update, delete)
- ✅ Manage patients
- ✅ Create/manage checklist templates with dynamic fields
- ✅ View all patient records and history
- ✅ Dashboard with statistics and charts
- ✅ Generate reports, export to PDF/Excel
- ✅ Profile settings

### Doctor Panel
- ✅ Authentication with email/password
- ✅ Manage assigned patients
- ✅ Fill out checklist forms for patients
- ✅ Save and submit responses with validation
- ✅ Add prescribed medicine after completing checklist
- ✅ View/edit patient records
- ✅ Dashboard with personal statistics
- ✅ Generate reports, export to PDF/Excel
- ✅ Profile settings

### Security
- ✅ JWT/Token-based authentication (Sanctum)
- ✅ Role-based access control (Admin/Doctor)
- ✅ Password hashing with bcrypt
- ✅ Account lockout after failed login attempts
- ✅ Email verification and password reset
- ✅ Input validation and sanitization
- ✅ Audit logging for actions
- ✅ CSRF protection

## Deployment to Netlify (Frontend)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Set build command: `npm run build`
   - Set publish directory: `build/`

3. **Set environment variables in Netlify:**
   - `REACT_APP_API_URL` = your backend API URL

4. **Deploy:**
   - Push to your Git repository
   - Netlify will automatically build and deploy

## Environment Configuration

### Backend (.env)
```
APP_NAME="Checklist Management"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=checklist_management
DB_USERNAME=root
DB_PASSWORD=

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Testing

### Backend
```bash
cd backend
php artisan test
```

### Frontend
```bash
cd frontend
npm test
```

## Troubleshooting

### CORS Issues
Ensure your backend has CORS enabled. Update `config/cors.php` if needed.

### MySQL Connection Error
- Check your `.env` database credentials
- Ensure MySQL service is running
- Verify database exists

### Port Already in Use
- Backend: Change port in `APP_URL` or use `php artisan serve --port=8001`
- Frontend: Use `PORT=3001 npm start`

## Contributing
- Follow Laravel/React best practices
- Write tests for new features
- Ensure code follows PSR-12 standards

## License
MIT License

## Support
For issues and questions, please refer to the project documentation.
