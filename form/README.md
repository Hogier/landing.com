# Contact Form System

This is a simple contact form system that allows visitors to submit inquiries through a form. The submissions are stored in a database and can be viewed by administrators.

## Features

- Form submission with validation
- Database storage of form submissions
- Admin panel to view all submissions
- Responsive design

## Setup Instructions

1. Make sure you have PHP and MySQL installed (e.g., through XAMPP, WAMP, or MAMP)
2. Create the database and table using the SQL script:

   ```
   mysql -u root -p < create_db.sql
   ```

   Or import the `create_db.sql` file through phpMyAdmin

3. Configure the database connection in `config.php` if needed:

   - Update the hostname, username, password, and database name if they differ from the defaults

4. Place all files in your web server's document root or a subdirectory
5. Access the form via your web browser at `http://localhost/your-directory/index.html`
6. Access the admin panel at `http://localhost/your-directory/admin.php`

## Files

- `index.html` - The main webpage with the contact form
- `save_form.php` - Handles form submission and saves data to the database
- `admin.php` - Admin panel to view all form submissions
- `config.php` - Database connection configuration
- `create_db.sql` - SQL script to create the necessary database and table
- `style.css` - Stylesheet for the website
- `scripts.js` - JavaScript functionality for the website

## Database Structure

The `contact_form_db` table contains the following fields:

- `id` - Auto-incremented primary key
- `name` - Name of the person submitting the form
- `company` - Company name
- `email` - Email address
- `phone` - Phone number
- `employees` - Number of employees (1-10, 11-50, 51-200, 201+)
- `message` - Optional message text
- `agreement` - Whether the user agreed to the data processing terms
- `created_at` - Timestamp of when the form was submitted
