<?php 


require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../controllers/User.php';
// require_once __DIR__ . '/../controllers/Protect.php';



//POST register a user
router('POST', '^/users/register$', function() {
    $data = json_decode(file_get_contents('php://input'), true);
    $user = new User($GLOBALS['DATABASE']);
    $user->validateRegisterData($data);
    $user->register($data);
  });

  
//POST login a user
router('POST', '^/users/login$', function() {
    $data = json_decode(file_get_contents('php://input'), true);
    $user = new User($GLOBALS['DATABASE']);
    $user->login($data);
  });

?>