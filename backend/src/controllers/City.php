<?php

class City
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

  public function getAll(): array
  {

    $sql= "SELECT
    city.id,
    city.name,
    city.image,
    city.available,
    GROUP_CONCAT(DISTINCT zones.color ORDER BY zones.color ASC SEPARATOR ', ') AS colors
FROM
    city
LEFT JOIN
    zones ON city.id = zones.city_id
GROUP BY
    city.id;";

    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('message' => 'There are no citys which is impossible...Maybe come again soon :) .');
  }
  public function getCityAvailable(): array
  {
    $sql = "SELECT * FROM city WHERE available=1";

    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $data ? array('data' => $data) : array('message' => 'There are no citys which is impossible...Maybe come again soon :) .');
  }


  public function searchCities(string $query): array
  {
    $trimmedQuery = trim($query);
    if (empty($trimmedQuery)) {
      http_response_code(400);
      echo json_encode(['message' => 'Search query is empty']);
      exit;
    }
    $sql = "SELECT
        city.id,
        city.name,
        city.image,
        city.available,
        GROUP_CONCAT(DISTINCT zones.color ORDER BY zones.color ASC SEPARATOR ', ') AS colors
    FROM
        city
    LEFT JOIN
        zones ON city.id = zones.city_id
    WHERE
        city.name LIKE :query
    GROUP BY
        city.id
    LIMIT 10;
";


    // $sql = "SELECT id, name FROM city WHERE name LIKE :query LIMIT 10";
    $stmt = $this->conn->prepare($sql);
    $searchPattern = "%" . $trimmedQuery . "%";
    $stmt->bindParam(':query', $searchPattern, PDO::PARAM_STR);
    $stmt->execute();
    $cities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $cities;
  }
  public function searchZones(string $city): array
  {
    $trimmedCity = trim($city);
    if (empty($trimmedCity)) {
        http_response_code(400);
        echo json_encode(['message' => 'No such city... Sorry!']);
        exit;
    }
    
    $sql = "SELECT z.id,z.city_id ,z.zone_name, z.color, z.price, z.sms, z.parking_limit, z.description, c.name, c.image 
            FROM zones z 
            JOIN city c ON z.city_id = c.id 
            WHERE z.city_id = :city";
    
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':city', $trimmedCity, PDO::PARAM_STR);
    $stmt->execute();
    $zones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($zones)) {
      http_response_code(400);
      echo json_encode(['message' => 'No such city... Sorry!']);
      exit;
  }
    return $zones;
    
  }


  
}