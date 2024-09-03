<?php
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header("Access-Control-Allow-Origin: {$_ENV['APP_URL']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if ($_SERVER['HTTP_ORIGIN'] == $_ENV['APP_URL']) {
    header("HTTP/1.1 200 OK");
  } else {
    header("HTTP/1.1 403 Forbidden");
  }
  exit(0);
}

require_once __DIR__ . '/../src/utils/user.php';
// require_once __DIR__ . '/../src/utils/email.php';
require_once __DIR__ . '/../src/utils/token.php';
// require_once __DIR__ . '/../src/utils/vet.php';
// require_once __DIR__ . '/../src/utils/schedule.php';
// require_once __DIR__ . '/../src/utils/appointment.php';
require_once __DIR__ . '/../src/database/Database.php';


$GLOBALS['DATABASE'] = new Database($_ENV['DATABASE_HOST'], $_ENV['DATABASE_NAME'], $_ENV['DATABASE_USER'], $_ENV['DATABASE_PASSWORD']);

require_once __DIR__ . '/../src/functions.php';
require_once __DIR__ . '/../src/routes/userRoutes.php';
require_once __DIR__ . '/../src/routes/platesRoutes.php';
require_once __DIR__ . '/../src/routes/cityRoutes.php';
require_once __DIR__ . '/../src/routes/historyRoutes.php';
// require_once __DIR__ . '/../src/routes/breedRoutes.php';
// require_once __DIR__ . '/../src/routes/vetRoutes.php';
// require_once __DIR__ . '/../src/routes/ambulanceRoutes.php';
// require_once __DIR__ . '/../src/routes/appointmentRoutes.php';
// require_once __DIR__ . '/../src/routes/treatmentRoutes.php';
// require_once __DIR__ . '/../src/routes/scheduleRoutes.php';
// require_once __DIR__ . '/../src/routes/adminRoutes.php';
// require_once __DIR__ . '/../src/routes/logsRoutes.php';



header("HTTP/1.0 404 Not Found");
echo json_encode(['message' => '404 Not Found']);