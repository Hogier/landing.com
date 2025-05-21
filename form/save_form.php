<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include configuration file
require_once 'config.php';

// Конфигурация для Telegram
define('TELEGRAM_BOT_TOKEN', '8021595614:AAFLYiZ4HhD6e2QsQEgo7HbgMOC1WuT_nqk'); // Токен бота
define('TELEGRAM_CHAT_ID', '-1002661290428'); // ID группы

/**
 * Функция для отправки сообщения в Telegram
 * @param string $message Текст сообщения
 * @return bool Результат отправки
 */
function sendTelegramMessage($message) {
    $apiToken = TELEGRAM_BOT_TOKEN;
    $chatId = TELEGRAM_CHAT_ID;
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML' // Позволяет использовать HTML-разметку в сообщении
    ];
    
    $url = "https://api.telegram.org/bot{$apiToken}/sendMessage";
    
    // Используем cURL для отправки запроса
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Проверяем ответ
    $responseData = json_decode($response, true);
    return isset($responseData['ok']) && $responseData['ok'];
}

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
            // Формируем сообщение для Telegram
            $telegramMessage = "<b>NEW ORDER</b>\n\n"
                . "<b>Name:</b> " . htmlspecialchars($name) . "\n"
                . "<b>Company:</b> " . htmlspecialchars($company) . "\n"
                . "<b>Email:</b> " . htmlspecialchars($email) . "\n"
                . "<b>Phone:</b> " . htmlspecialchars($phone) . "\n"
                . "<b>Employees:</b> " . htmlspecialchars($employees) . "\n";
            
            if (!empty($message)) {
                $telegramMessage .= "<b>Message:</b> " . htmlspecialchars($message) . "\n";
            }
            
            // Отправляем сообщение в Telegram
            $telegramSent = sendTelegramMessage($telegramMessage);
            
            // Отвечаем клиенту
            echo json_encode([
                "success" => true, 
                "message" => "Form submitted successfully", 
                "telegram_sent" => $telegramSent
            ]);
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