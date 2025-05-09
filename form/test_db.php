<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include configuration file
require_once 'config.php';

echo "<h1>Database Connection Test</h1>";

try {
    // Get database connection
    $conn = getDbConnection();
    echo "<p style='color:green'>Database connection successful to 'contact_form_db'!</p>";
    
    // Check if table exists
    $result = $conn->query("SHOW TABLES LIKE 'contacts'");
    if ($result->num_rows > 0) {
        echo "<p style='color:green'>Table 'contacts' exists!</p>";
        
        // Show table structure
        $result = $conn->query("DESCRIBE contacts");
        echo "<h2>Table Structure:</h2>";
        echo "<table border='1'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "<td>" . ($row['Default'] === null ? 'NULL' : $row['Default']) . "</td>";
            echo "<td>" . $row['Extra'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color:red'>Table 'contacts' does not exist!</p>";
        echo "<p>Creating table...</p>";
        
        // Try to create the table
        $create_table_sql = file_get_contents('create_db.sql');
        if ($conn->multi_query($create_table_sql)) {
            echo "<p style='color:green'>Table created successfully! Please refresh this page.</p>";
        } else {
            echo "<p style='color:red'>Error creating table: " . $conn->error . "</p>";
        }
    }
    
    $conn->close();
} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}
?> 