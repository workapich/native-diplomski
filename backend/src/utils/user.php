<?php

function getUserById(int $id, PDO $conn): array {
  $sql = "SELECT ";

  return [];
}


function getUserByEmail(string $email, PDO $conn): array | bool {
  $sql = "SELECT 
  users.id,
  users.email,
  users.username,
  users.password,
  users.status,
  plates.label
FROM 
  users
LEFT JOIN 
  plates 
ON 
  plates.id_owner = users.id AND plates.active = 1
WHERE 
  users.email = :email;

";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  $user = $stmt->fetch();

  return $user;
}

function hashPassword(string $password): string {
  return hash(PASSWORD_BCRYPT, $password);
}