<?php
// Database configuration
$config = [
    'db' => [
        'host' => 'localhost',
        'username' => 'root',
        'password' => 'root',
        'database' => 'contact_form_db'
    ]
];

// Function to get database connection
function getDbConnection() {
    global $config;
    
    $conn = new mysqli(
        $config['db']['host'],
        $config['db']['username'],
        $config['db']['password'],
        $config['db']['database']
    );
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?> 