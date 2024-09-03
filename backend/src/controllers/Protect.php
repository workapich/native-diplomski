<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Protect
{
  private PDO $conn;

  public function __construct(Database $database)
  {
    $this->conn = $database->getConnection();
  }

  public function validate(): void
  {
    $token = getBearerToken();

    try {
      $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']));
    } catch (\Throwable $th) {
      http_response_code(401);
      echo json_encode([
        'message' => 'Invalid token!',
      ]);
      exit;
    }

    if ($decoded) {

      if ($decoded->table === 'users') {
        $user = new User($GLOBALS['DATABASE']);
      } else {
       //place for admin
      }

      $user = $user->getById($decoded->id);

      if (!$user) {
        http_response_code(401);
        echo json_encode([
          'message' => 'User does not exist!',
        ]);
      } else {
        $GLOBALS['USER'] = $user;
      }
    }
  }
 

  
}