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

// Logout functionality
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Filter settings
$filter_period = $_GET['period'] ?? 'all';
$custom_start = $_GET['start_date'] ?? '';
$custom_end = $_GET['end_date'] ?? '';

// Create connection
try {
    $conn = getDbConnection();
    
    // Base query
    $sql = "SELECT * FROM contacts";
    
    // Date filter conditions
    $where_conditions = [];
    $today = date('Y-m-d');
    
    switch ($filter_period) {
        case 'today':
            $where_conditions[] = "DATE(created_at) = '$today'";
            break;
        case 'week':
            $week_ago = date('Y-m-d', strtotime('-1 week'));
            $where_conditions[] = "DATE(created_at) BETWEEN '$week_ago' AND '$today'";
            break;
        case 'month':
            $month_ago = date('Y-m-d', strtotime('-1 month'));
            $where_conditions[] = "DATE(created_at) BETWEEN '$month_ago' AND '$today'";
            break;
        case 'half_year':
            $half_year_ago = date('Y-m-d', strtotime('-6 months'));
            $where_conditions[] = "DATE(created_at) BETWEEN '$half_year_ago' AND '$today'";
            break;
        case 'year':
            $year_ago = date('Y-m-d', strtotime('-1 year'));
            $where_conditions[] = "DATE(created_at) BETWEEN '$year_ago' AND '$today'";
            break;
        case 'custom':
            if (!empty($custom_start) && !empty($custom_end)) {
                $where_conditions[] = "DATE(created_at) BETWEEN '$custom_start' AND '$custom_end'";
            }
            break;
    }
    
    // Apply conditions to the query
    if (!empty($where_conditions)) {
        $sql .= " WHERE " . implode(' AND ', $where_conditions);
    }
    
    // Ordering
    $sql .= " ORDER BY created_at DESC";
    
    // Execute query
    $result = $conn->query($sql);
    
    if ($result === false) {
        throw new Exception("Error executing query: " . $conn->error);
    }
} catch (Exception $e) {
    $error_message = "Database error: " . $e->getMessage();
}

// Build current URL for delete action return
$current_url = 'admin.php';
if (!empty($_SERVER['QUERY_STRING'])) {
    $current_url .= '?' . $_SERVER['QUERY_STRING'];
}
$encoded_url = urlencode($current_url);

// Get current filter period for display
function getFilterText($period, $custom_start, $custom_end) {
    switch ($period) {
        case 'today':
            return 'Today';
        case 'week':
            return 'Last 7 days';
        case 'month':
            return 'Last 30 days';
        case 'half_year':
            return 'Last 6 months';
        case 'year':
            return 'Last year';
        case 'custom':
            if (!empty($custom_start) && !empty($custom_end)) {
                return "From $custom_start to $custom_end";
            }
            return 'Custom period';
        default:
            return 'All time';
    }
}

$filter_text = getFilterText($filter_period, $custom_start, $custom_end);

// Check for delete feedback messages
$success_message = $_SESSION['delete_success'] ?? null;
$error_message = $_SESSION['delete_error'] ?? $error_message ?? null;

// Clear session messages after reading
unset($_SESSION['delete_success']);
unset($_SESSION['delete_error']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Contact Form Submissions</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        table, th, td {
            border: 1px solid #ddd;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #f2f2f2;
        }
        
        tr:hover {
            background-color: #f5f5f5;
        }
        
        .message-cell {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .admin-controls {
            display: flex;
            gap: 10px;
        }
        
        .back-link, .logout-link, .print-button {
            display: inline-block;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .back-link {
            background-color: #f2f2f2;
        }
        
        .logout-link {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .print-button {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        
        .back-link:hover {
            background-color: #e0e0e0;
        }
        
        .logout-link:hover {
            background-color: #f5c6cb;
        }
        
        .print-button:hover {
            background-color: #bee5eb;
        }
        
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .no-data {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
            text-align: center;
            color: #6c757d;
            margin-top: 20px;
        }
        
        .filter-section {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .filter-form {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: flex-end;
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .filter-group label {
            font-weight: 500;
            font-size: 14px;
        }
        
        .filter-group select, .filter-group input[type="date"] {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-width: 150px;
        }
        
        .filter-group input[type="date"] {
            min-width: 180px;
        }
        
        .filter-buttons {
            display: flex;
            gap: 10px;
        }
        
        .filter-buttons button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .apply-filter {
            background-color: #4a6cf7;
            color: white;
        }
        
        .reset-filter {
            background-color: #f2f2f2;
            color: #333;
        }
        
        .apply-filter:hover {
            background-color: #3a5cf5;
        }
        
        .reset-filter:hover {
            background-color: #e0e0e0;
        }
        
        .filter-status {
            margin-top: 10px;
            font-style: italic;
            color: #6c757d;
        }
        
        .delete-button {
            background-color: #dc3545;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }
        
        .delete-button:hover {
            background-color: #bd2130;
        }
        
        .actions-cell {
            white-space: nowrap;
            text-align: center;
        }
        
        @media print {
            .admin-controls, .filter-section, .no-print, .actions-column, .actions-cell {
                display: none !important;
            }
            
            body {
                padding: 0;
                margin: 0;
                font-family: Arial, Helvetica, sans-serif;
                color: #333;
                background: white;
            }
            
            .admin-container {
                width: 100%;
                max-width: none;
                padding: 0;
                margin: 0;
            }
            
            /* Удаляем стандартные стили таблицы для печати */
            table, tr, td, th, thead, tbody {
                display: block;
                width: 100%;
                border: none;
                margin: 0;
                padding: 0;
            }
            
            table {
                display: flex;
                flex-wrap: wrap;
                gap: 10mm;
                justify-content: space-between;
                page-break-inside: auto;
            }
            
            thead {
                display: none; /* Скрываем заголовки колонок */
            }
            
            tr {
                width: calc(50% - 5mm);
                margin-bottom: 5mm;
                page-break-inside: avoid;
                border: 1px solid #ddd;
                border-radius: 5mm;
                padding: 5mm;
                box-shadow: 0 1mm 3mm rgba(0,0,0,0.1);
                position: relative;
                background-color: #fff;
            }
            
            td {
                display: block;
                padding: 2mm 0;
                border-bottom: none;
                position: relative;
                padding-left: 40%;
                min-height: 5mm;
            }
            
            /* Создаем метки для полей */
            td:before {
                content: "";
                position: absolute;
                left: 0;
                width: 35%;
                padding-right: 5%;
                font-weight: bold;
                text-align: right;
            }
            
            td:nth-of-type(1):before { content: "ID:"; }
            td:nth-of-type(2):before { content: "Имя:"; }
            td:nth-of-type(3):before { content: "Компания:"; }
            td:nth-of-type(4):before { content: "Email:"; }
            td:nth-of-type(5):before { content: "Телефон:"; }
            td:nth-of-type(6):before { content: "Сотрудники:"; }
            td:nth-of-type(7):before { content: "Сообщение:"; }
            td:nth-of-type(8):before { content: "Соглашение:"; }
            td:nth-of-type(9):before { content: "Дата:"; }
            
            /* Стили для сообщения */
            td:nth-of-type(7) {
                margin-top: 3mm;
                padding-top: 3mm;
                border-top: 1px solid #eee;
                white-space: normal;
                max-width: none;
            }
            
            .message-cell {
                max-width: none;
                white-space: normal;
                overflow: visible;
                text-overflow: clip;
            }
            
            .print-header {
                text-align: center;
                margin-bottom: 15mm;
                border-bottom: 2px solid #4a6cf7;
                padding-bottom: 5mm;
                display: block !important;
            }
            
            .print-header h1 {
                color: #4a6cf7;
                margin: 0;
                padding: 0;
                font-size: 24pt;
            }
            
            .print-header .company-name {
                font-size: 14pt;
                margin-top: 5px;
                color: #555;
            }
            
            .print-period {
                text-align: center;
                font-style: italic;
                margin-bottom: 10mm;
                padding: 3mm;
                background-color: #f8f9fa;
                border-radius: 2mm;
                display: block !important;
            }
            
            .print-period p {
                margin: 1mm 0;
            }
            
            .print-summary {
                margin: 5mm 0 10mm 0;
                padding: 5mm;
                background-color: #f8f9fa;
                border-radius: 2mm;
                border-left: 4px solid #4a6cf7;
                display: block !important;
            }
            
            .print-summary h2 {
                margin-top: 0;
                color: #4a6cf7;
                font-size: 14pt;
            }
            
            .print-footer {
                margin-top: 10mm;
                padding-top: 5mm;
                border-top: 1px solid #ddd;
                text-align: center;
                font-size: 9pt;
                color: #777;
                display: block !important;
            }
            
            /* Добавляем номер страницы */
            @page {
                counter-increment: page;
                @bottom-center {
                    content: "Страница " counter(page);
                    font-size: 8pt;
                    color: #777;
                }
            }
            
            /* Дополнительные стили для карточек */
            tr:nth-child(odd) {
                background-color: #f9f9f9;
            }
            
            /* Добавляем иконки для визуального улучшения */
            td:nth-of-type(4) { /* Email */
                word-break: break-all;
            }
            
            /* Цветовая маркировка для важных данных */
            td:nth-of-type(9) { /* Дата */
                color: #666;
                font-style: italic;
                border-top: 1px solid #eee;
                margin-top: 3mm;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header no-print">
            <h1>Contact Form Submissions</h1>
            <div class="admin-controls">
                <a href="../index.html" class="back-link">Back to Website</a>
                <a href="?logout=1" class="logout-link">Logout</a>
                <a class="print-button" onclick="window.print()">Print Results</a>
            </div>
        </div>
        
        <div class="print-header" style="display: none;">
            <h1>Contact Form Submissions Report</h1>
            <div class="company-name">StaffPro Contact Management System</div>
        </div>
        
        <div class="print-period" style="display: none;">
            <p><strong>Period:</strong> <?php echo $filter_text; ?></p>
            <p><strong>Generated on:</strong> <?php echo date('F j, Y, g:i a'); ?></p>
        </div>
        
        <div class="print-summary" style="display: none;">
            <h2>Report Summary</h2>
            <p><strong>Total submissions:</strong> <?php echo isset($result) ? $result->num_rows : 0; ?></p>
            <p>This report contains all contact form submissions received <?php echo strtolower($filter_text); ?>.</p>
        </div>
        
        <?php if (isset($success_message)): ?>
            <div class="success-message">
                <?php echo $success_message; ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="error-message">
                <?php echo $error_message; ?>
            </div>
        <?php endif; ?>
        
        <div class="filter-section no-print">
            <form class="filter-form" method="get">
                <div class="filter-group">
                    <label for="period">Filter by period:</label>
                    <select id="period" name="period" onchange="toggleCustomDates()">
                        <option value="all" <?php echo $filter_period === 'all' ? 'selected' : ''; ?>>All time</option>
                        <option value="today" <?php echo $filter_period === 'today' ? 'selected' : ''; ?>>Today</option>
                        <option value="week" <?php echo $filter_period === 'week' ? 'selected' : ''; ?>>Last 7 days</option>
                        <option value="month" <?php echo $filter_period === 'month' ? 'selected' : ''; ?>>Last 30 days</option>
                        <option value="half_year" <?php echo $filter_period === 'half_year' ? 'selected' : ''; ?>>Last 6 months</option>
                        <option value="year" <?php echo $filter_period === 'year' ? 'selected' : ''; ?>>Last year</option>
                        <option value="custom" <?php echo $filter_period === 'custom' ? 'selected' : ''; ?>>Custom period</option>
                    </select>
                </div>
                
                <div class="filter-group custom-dates" style="<?php echo $filter_period !== 'custom' ? 'display: none;' : ''; ?>">
                    <label for="start_date">Start date:</label>
                    <input type="date" id="start_date" name="start_date" value="<?php echo $custom_start; ?>">
                </div>
                
                <div class="filter-group custom-dates" style="<?php echo $filter_period !== 'custom' ? 'display: none;' : ''; ?>">
                    <label for="end_date">End date:</label>
                    <input type="date" id="end_date" name="end_date" value="<?php echo $custom_end; ?>">
                </div>
                
                <div class="filter-buttons">
                    <button type="submit" class="apply-filter">Apply Filter</button>
                    <button type="button" class="reset-filter" onclick="window.location.href='admin.php'">Reset</button>
                </div>
            </form>
            
            <?php if ($filter_period !== 'all'): ?>
                <div class="filter-status">
                    <p>Showing results for: <?php echo $filter_text; ?></p>
                </div>
            <?php endif; ?>
        </div>
        
        <?php if (!isset($error_message) || $error_message === null): ?>
            <?php if (isset($result) && $result->num_rows > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Employees</th>
                            <th>Message</th>
                            <th>Agreement</th>
                            <th>Submitted At</th>
                            <th class="actions-column no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($row = $result->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo $row["id"]; ?></td>
                                <td><?php echo htmlspecialchars($row["name"]); ?></td>
                                <td><?php echo htmlspecialchars($row["company"]); ?></td>
                                <td><?php echo htmlspecialchars($row["email"]); ?></td>
                                <td><?php echo htmlspecialchars($row["phone"]); ?></td>
                                <td><?php echo htmlspecialchars($row["employees"]); ?></td>
                                <td class="message-cell"><?php echo htmlspecialchars($row["message"]); ?></td>
                                <td><?php echo $row["agreement"] ? "Yes" : "No"; ?></td>
                                <td><?php echo $row["created_at"]; ?></td>
                                <td class="actions-cell no-print">
                                    <button 
                                        class="delete-button" 
                                        onclick="confirmDelete(<?php echo $row['id']; ?>, '<?php echo $encoded_url; ?>')"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">
                    <p>No form submissions found for the selected period.</p>
                    <?php if ($filter_period !== 'all'): ?>
                        <p>Try selecting a different time period or <a href="admin.php">view all submissions</a>.</p>
                    <?php else: ?>
                        <p>When visitors submit the contact form, their submissions will appear here.</p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
    
    <div class="print-footer" style="display: none;">
        <p>StaffPro Contact Management System &copy; <?php echo date('Y'); ?> | Confidential information</p>
        <p>For internal use only</p>
    </div>
    
    <script>
        // Show print headers when printing
        window.onbeforeprint = function() {
            document.querySelector('.print-header').style.display = 'block';
            document.querySelector('.print-period').style.display = 'block';
            document.querySelector('.print-summary').style.display = 'block';
            document.querySelector('.print-footer').style.display = 'block';
            
            // Format dates in more readable format in table before printing
            const dateCells = document.querySelectorAll('td:nth-child(9)');
            dateCells.forEach(cell => {
                try {
                    const dateString = cell.textContent.trim();
                    const date = new Date(dateString);
                    if(!isNaN(date.getTime())) {
                        const formattedDate = date.toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        cell.setAttribute('data-original', dateString);
                        cell.textContent = formattedDate;
                    }
                } catch(e) {
                    // Keep original format if error
                }
            });
        };
        
        window.onafterprint = function() {
            document.querySelector('.print-header').style.display = 'none';
            document.querySelector('.print-period').style.display = 'none';
            document.querySelector('.print-summary').style.display = 'none';
            document.querySelector('.print-footer').style.display = 'none';
            
            // Restore original date format
            const dateCells = document.querySelectorAll('td:nth-child(9)');
            dateCells.forEach(cell => {
                const original = cell.getAttribute('data-original');
                if(original) {
                    cell.textContent = original;
                }
            });
        };
        
        // Toggle custom date inputs
        function toggleCustomDates() {
            const periodSelect = document.getElementById('period');
            const customDateElements = document.querySelectorAll('.custom-dates');
            
            if (periodSelect.value === 'custom') {
                customDateElements.forEach(el => el.style.display = 'flex');
            } else {
                customDateElements.forEach(el => el.style.display = 'none');
            }
        }
        
        // Confirm delete function
        function confirmDelete(id, returnUrl) {
            if (confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
                window.location.href = `delete_entry.php?id=${id}&return=${returnUrl}`;
            }
        }
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?> 