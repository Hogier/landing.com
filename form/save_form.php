<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include configuration file
require_once 'config.php';

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Get form data
        $name = $_POST['name'];
        $company = $_POST['company'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $employees = $_POST['employees'];
        $message = isset($_POST['message']) ? $_POST['message'] : null;
        $agreement = isset($_POST['agreement']) ? 1 : 0;
        
        // Get database connection
        $conn = getDbConnection();
        
        // Prepare SQL statement
        $sql = "INSERT INTO contacts (name, company, email, phone, employees, message, agreement)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            throw new Exception("Error preparing statement: " . $conn->error);
        }
        
        $stmt->bind_param("ssssssi", $name, $company, $email, $phone, $employees, $message, $agreement);
        
        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Form submitted successfully"]);
        } else {
            throw new Exception("Error executing statement: " . $stmt->error);
        }
        
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // Log the error
        error_log('Form submission error: ' . $e->getMessage());
        
        // Return JSON error response
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit;
}
?> 