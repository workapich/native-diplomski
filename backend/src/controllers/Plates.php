<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// use Detection\MobileDetect;

class Plate
{
  private PDO $conn;

  public function __construct(Database $database)
  {
    $this->conn = $database->getConnection();
  }

  public function addPlate(array $data):void{
      $sql = "INSERT INTO plates(label, id_owner, plate_type)
                  VALUES(:label, :id_owner, :plate_type)";
  
      $kojiID = $GLOBALS['USER']['id'];
      $trimmedPlate = trim($data['plate']);
      $trimmedType = trim($data['type']);
  
      $trimmedId_Owner = $kojiID;
  
      $stmt = $this->conn->prepare($sql);
  
      $stmt->bindParam(':label', $trimmedPlate, PDO::PARAM_STR);
      $stmt->bindParam(':id_owner', $trimmedId_Owner, PDO::PARAM_STR);
      $stmt->bindParam(':plate_type', $trimmedType, PDO::PARAM_STR);
      $stmt->execute();
  
      $lastInsertedId = $this->conn->lastInsertId();
  
      if (!$lastInsertedId) {
        http_response_code(500);
        echo json_encode([
          "message" => "Internal server error!",
        ]);
        exit;
      }
  
      echo json_encode([
        'message' => 'Plate created successfully.',
        'plateID' => $lastInsertedId
      ]);
  }



  
  public function getAllPlates(): array
  {
    $sql = "SELECT * FROM plates where id_owner=:id order by plate_type";
    $kojiID = $GLOBALS['USER']['id'];

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id', $kojiID, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('message' => 'There are no plates ...Maybe add some :) .');
  }


  
  
  public function getActivePlate(): array
  {
    $sql = "SELECT id,label FROM plates where id_owner=:id and active=1";
    $kojiID = $GLOBALS['USER']['id'];

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id', $kojiID, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('data' => 'null');
  }



  

  
  public function getPlateById($id): array
  {
    $sql = "SELECT * FROM plates where id=:id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('message' => 'There are no plates with this id.');
  }  
  public function delete(string $plateId): void
  {
    $trimmedId = trim($plateId);

    if (!$trimmedId) {
      http_response_code(400);
      echo json_encode([
        'message' => 'Plate id parameter is required!',
      ]);
      exit;
    }

    $plate = $this->getPlateById($trimmedId)['data'] ?? null;
    if (!$plate) {
      http_response_code(400);
      echo json_encode([
        'message' => 'The plate does not exist.'
      ]);
      exit;
    }

    if (!$plate['id_owner'] || $plate['id_owner'] !== $GLOBALS['USER']['id']) {
      http_response_code(401);
      echo json_encode([
        'message' => 'This is not your plate!.'
      ]);
      exit;
    }

    $sql = 'DELETE FROM plates WHERE id = :plate_id';

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':plate_id', $trimmedId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() < 1) {
      http_response_code(500);
      echo json_encode([
        'message' => 'Internal Server Error.',
      ]);
    }

    echo json_encode([
      'message' => 'Plate removed successfully!'
    ]);
  }


  public function update(string $plateId): void
  {
    $trimmedId = trim($plateId);

    if (!$trimmedId) {
      http_response_code(400);
      echo json_encode([
        'message' => 'Plate id parameter is required!',
      ]);
      exit;
    }

    $plate = $this->getPlateById($trimmedId)['data'] ?? null;
    if (!$plate) {
      http_response_code(400);
      echo json_encode([
        'message' => 'The plate does not exist.'
      ]);
      exit;
    }

    if (!$plate['id_owner'] || $plate['id_owner'] !== $GLOBALS['USER']['id']) {
      http_response_code(401);
      echo json_encode([
        'message' => 'This is not your plate!.'
      ]);
      exit;
    }

    $sql = 'UPDATE plates
    SET active = CASE 
                    WHEN id = :sent_id THEN 1 
                    ELSE 0 
                 END
    WHERE id_owner = :global_user_id;';
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':sent_id', $trimmedId, PDO::PARAM_INT);
    $stmt->bindValue(':global_user_id',$GLOBALS['USER']['id'] , PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() < 1 ) {
      http_response_code(500);
      echo json_encode([
        'message' => 'Internal Server Error.',
      ]);
    }

    echo json_encode([
      'message' => 'Active plate changed!'
    ]);
  }

  
  public function validatePlateData(array $data): void
  {
    $trimmedPlate = trim($data['plate']);
    $trimmedType = trim($data['type']);

    $sql = "SELECT * FROM plates where id_owner=:id";
    
    $kojiID = $GLOBALS['USER']['id'];

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id', $kojiID, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if($data && count($data)>=3)
    {
        http_response_code(400);
        echo json_encode([
            'message'=>'You can not have more than 3 plates!',
        ]);
        exit; 
    }

    if( ($trimmedType==="STANDARD" && !checkPlate($trimmedPlate)))
    {
        http_response_code(400);
        echo json_encode([
            'message'=>'This is not the standard format!',
        ]);
        exit; 
    }
    
    if($trimmedType!=="STANDARD" && $trimmedType!=="OTHER")
    {
        http_response_code(400);
        echo json_encode([
            'message'=>'Choose a correct plate format',
        ]);
        exit; 
    }
  }


//     if(!trim($data['firstName']) || strlen(trim($data['firstName']))<3 )
//     {
//         http_response_code(400);
//         echo json_encode([
//             'message'=>'First name should be more than 3 characters long!',
//         ]);
//         exit;
//     }
//     if(!trim($data['lastName']) || strlen(trim($data['lastName']))<3 )
//     {
//         http_response_code(400);
//         echo json_encode([
//             'message'=>'Last name should be more than 3 characters long!',
//         ]);
//         exit;
//     }
//     if (strlen(trim($data['firstName'])) > 20) {
//         http_response_code(400);
//         echo json_encode([
//           'message' => 'First name should be less than 21 characters long!',
//         ]);
//         exit;
//       }

//       if (strlen(trim($data['lastName'])) > 20) {
//         http_response_code(400);
//         echo json_encode([
//           'message' => 'Last name should be less than 21 characters long!',
//         ]);
//         exit;
//       }
  
//       if (!trim($data['email']) || !filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) {
//         http_response_code(400);
//         echo json_encode([
//           'message' => 'Valid email address is required!',
//         ]);
//         exit;
//       }
  
//       if (!trim($data['password']) || strlen(trim($data['password'])) < 4) {
//         http_response_code(400);
//         echo json_encode([
//           'message' => 'Password should be more than 4 characters long!',
//         ]);
//         exit;
//       }
  
//       if (strlen(trim($data['password'])) > 20) {
//         http_response_code(400);
//         echo json_encode([
//           'message' => 'Password should be less than 21 characters long!',
//         ]);
//         exit;
//       }

//       $userExists = getUserByEmail($data['email'], $this->conn);

//     if ($userExists) {
//       http_response_code(400);
//       echo json_encode([
//         'message' => 'User with this email already exists!',
//       ]);
//       exit;
//     }
    
//   }
 



 




}
