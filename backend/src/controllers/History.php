<?php

class History
{
  private PDO $conn;

  public function __construct(Database $database)
  {
    $this->conn = $database->getConnection();
  }

  public function getById(string $id): array
  {

    $trimmedId = trim($id);

    if (!$trimmedId) {
      http_response_code(400);
      echo json_encode([
        'message' > 'City id param is required!',
      ]);
      exit;
    }

    $sql = "SELECT * FROM city WHERE id = :id";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":id", $trimmedId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
      http_response_code(404);
      echo json_encode([
        'message' => "City not found!",
      ]);
      exit;
    }

    return $data;
  }

  public function getAll($limits=null): array
  {
    $sql = "SELECT 
    history.*,
    zones.zone_name,
    zones.color,
    zones.price,
    zones.sms,
    zones.parking_limit,
    zones.description,
    city.name AS city_name,
    city.image AS city_image
FROM 
    history
JOIN 
    zones ON history.id_zone = zones.id
JOIN 
    city ON zones.city_id = city.id
WHERE 
    history.id_owner = :id_owner
ORDER BY 
    history.payment_time DESC 
 ";
    if($limits!==null)
    $sql.="LIMIT 5";
//gledaj u prosli
$kojiID = $GLOBALS['USER']['id'];

    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':id_owner', $kojiID, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('message' => 'You havent got any history! Maybe use our app ? .');
  }


  
  public function addPayment(array $data):void{
    $sql = "INSERT INTO history(id_owner, id_city, id_zone,payment_time)
                VALUES(:id_owner, :id_city, :id_zone,:payment_time)";

    $kojiID = $GLOBALS['USER']['id'];
    $trimmedCity = trim($data['trimmedCity']);
    $trimmedZone = trim($data['trimmedZone']);
    $currentDateTime = date('Y-m-d H:i:s');

    $stmt = $this->conn->prepare($sql);

    $stmt->bindParam(':id_owner', $kojiID, PDO::PARAM_STR);
    $stmt->bindParam(':id_city', $trimmedCity, PDO::PARAM_STR);
    $stmt->bindParam(':id_zone', $trimmedZone, PDO::PARAM_STR);
    $stmt->bindParam(':payment_time', $currentDateTime, PDO::PARAM_STR);
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
      'message' => 'Payment created successfully.',
      'paymentID' => $lastInsertedId
    ]);
}




  
}