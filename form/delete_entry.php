<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Include configuration file
require_once 'config.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['delete_error'] = "No ID provided for deletion";
    header('Location: admin.php');
    exit;
}

// Get ID from request
$id = (int) $_GET['id'];

// Get return URL with filters preserved
$return_url = 'admin.php';
if (isset($_GET['return'])) {
    $return_url = $_GET['return'];
}

try {
    // Get database connection
    $conn = getDbConnection();
    
    // Prepare SQL statement
    $sql = "DELETE FROM contacts WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }
    
    // Bind parameters and execute
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        $_SESSION['delete_success'] = "Record #$id has been successfully deleted";
    } else {
        throw new Exception("Error executing statement: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    $_SESSION['delete_error'] = "Error: " . $e->getMessage();
}

// Redirect back to admin page
header("Location: $return_url");
exit;
?> 