<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// use Detection\MobileDetect;

class User
{
  private PDO $conn;

  public function __construct(Database $database)
  {
    $this->conn = $database->getConnection();
  }

  public function register(array $data):void{
    $sql="INSERT INTO users(email,username,password)
    VALUES(:email,:username,:password)
    ";

  $trimmedEmail = trim($data['email']);
  $trimmedUsername = trim($data['username']);

  // $registrationToken = JWT::encode([
  //   'email' => trim($data['email']),
  // ], $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);

  $stmt = $this->conn->prepare($sql);
  $hashedPassword = password_hash(trim($data['password']), PASSWORD_BCRYPT);

  $stmt->bindParam(':email', $trimmedEmail, PDO::PARAM_STR);
  $stmt->bindParam(':username', $trimmedUsername, PDO::PARAM_STR);
  $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
  // $stmt->bindParam(':registration_token', $registrationToken, PDO::PARAM_STR);
  $stmt->execute();


  $lastInsertedId = $this->conn->lastInsertId();

  if (!$lastInsertedId) {
    http_response_code(500);
    echo json_encode([
      "message" => "Internal server error!",
    ]);
    exit;
  }

  $sql = "SELECT id, email, username FROM users
  WHERE id=:id";

  $stmt = $this->conn->prepare($sql);
  $stmt->bindParam(':id', $lastInsertedId, PDO::PARAM_INT);
  $stmt->execute();
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    http_response_code(404);
    echo json_encode([
      "message" => "User not found",
    ]);
    exit;
  }
  echo json_encode([
      'message' => 'Check email to activate your account.',
    ]);


  }

 
  public function login(array $data): void
  {
    $action = 'LOGIN';

    if (!trim($data['email'])) {
      http_response_code(400);
      echo json_encode([
        'message' => 'Email address is required!',
      ]);
      exit;
    }

    if (!trim($data['password'])) {
      http_response_code(400);
      echo json_encode([
        'message' => 'Password is required!',
      ]);
      exit;
    }

    $user = getUserByEmail(trim($data['email']), $this->conn);

    if ($user === false) {
      http_response_code(401);
      echo json_encode([
        'message' => 'Invalid email address!',
      ]);
      exit;
    }

    $GLOBALS['USER'] = $user;

    if ($user['status'] === 0) {
      http_response_code(401);
      echo json_encode([
        'message' => 'Your account is not activated!',
      ]);
      exit;
    }


    if (!password_verify(trim($data['password']), $user['password'])) {
      http_response_code(401);
      echo json_encode([
        'message' => 'Invalid password!',
      ]);
      exit;
    }

    $token = JWT::encode([
      'id' => $user['id'],
      'table' => 'users',
    ], $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);
    echo json_encode([
      'data' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'token' => $token,
        'activeId' => $user['label'],
      ]
    ]);
    
  }

  
  public function getById($id): array
  {
    $sql = "SELECT id, email, username, password FROM users
    WHERE status=1 AND id=:id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      http_response_code(404);
      echo json_encode([
        "message" => "User not found",
      ]);
      exit;
    }

    return $user;
  }



  public function validateRegisterData(array $data): void
  {
    if(!trim($data['username']) || strlen(trim($data['username']))<3 )
    {
        http_response_code(400);
        echo json_encode([
            'message'=>'Username should be more than 3 characters long!',
        ]);
        exit;
    }
    
    if (strlen(trim($data['username'])) > 20) {
        http_response_code(400);
        echo json_encode([
          'message' => 'First name should be less than 21 characters long!',
        ]);
        exit;
      }

  
      if (!trim($data['email']) || !filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
          'message' => 'Valid email address is required!',
        ]);
        exit;
      }
  
      if (!trim($data['password']) || strlen(trim($data['password'])) < 4) {
        http_response_code(400);
        echo json_encode([
          'message' => 'Password should be more than 4 characters long!',
        ]);
        exit;
      }
  
      if (strlen(trim($data['password'])) > 20) {
        http_response_code(400);
        echo json_encode([
          'message' => 'Password should be less than 21 characters long!',
        ]);
        exit;
      }

      $userExists = getUserByEmail($data['email'], $this->conn);

    if ($userExists) {
      http_response_code(400);
      echo json_encode([
        'message' => 'User with this email already exists!',
      ]);
      exit;
    }
    
  }




}
