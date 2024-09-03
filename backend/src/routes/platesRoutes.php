<?php

require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../controllers/Plates.php';
require_once __DIR__ . '/../controllers/Protect.php';

//POST creating a treatment
router('POST', '^/plates/addPlate$', function () {
  $data = json_decode(file_get_contents('php://input'), true);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  $plate = new Plate($GLOBALS['DATABASE']);
  $plate->validatePlateData($data);
  $plate->addPlate($data);
});



//GET all plates by user
router('GET', '^/plate$', function () {
  $plate = new Plate($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  echo json_encode($plate->getAllPlates());
});

//GET all active plate for user
router('GET', '^/plate/active$', function () {
  $plate = new Plate($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  echo json_encode($plate->getActivePlate());
});





//GET plate by id
router('GET', '^/plate/(?<id>\d+)$', function($params) {
  $plate = new Plate($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  echo json_encode($plate->getPlateById($params['id']));
});


//DELETE delete plate data
router('DELETE', '^/plate/(?<id>\d+)$', function ($plateId) {
  // Validate user authentication
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();

  // Update pet data
  $plate = new Plate($GLOBALS['DATABASE']);
  $plate->delete($plateId['id']);
});



//PUT update plate data
router('PUT', '^/plate/(?<id>\d+)$', function($plateId) {
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  $active = new Plate($GLOBALS['DATABASE']);
  // $user->validateUpdateData($data);
  $active->update($plateId['id']);
});

// //POST creating a pet
// router('POST', '^/pets/addPet$', function () {
//     $protect = new Protect($GLOBALS['DATABASE']);
//     $protect->validate();
//     $pet = new Pet($GLOBALS['DATABASE']);
//     $pet->validatePetData($_POST);
//     $pet->addPet($_POST);
//   });

// //GET get all treatments
// router('GET', '^/treatments/$', function () {
//   $treatment = new Treatment($GLOBALS['DATABASE']);
//   $protect = new Protect($GLOBALS['DATABASE']);
//   $protect->validateVet();
//   $treatments = $treatment->getAllTreatments();

//   if (!$treatments) {
//     http_response_code(404);
//     echo json_encode([
//       'message' => 'No treatments!'
//     ]);
//     exit;
//   }

//   echo json_encode([
//     'data' => $treatments
//   ]);
// });

// //GET treatments by vet id 
// router('GET', '^/treatments/byVet/(?<id>\d+)$', function ($vetId) {
//   $treatment = new Treatment($GLOBALS['DATABASE']);
//   $protect = new Protect($GLOBALS['DATABASE']);
//   $protect->validate();
//   $treatments = $treatment->getTreatmentsByVet((int) $vetId['id']);

//   if (!$treatments) {
//     http_response_code(404);
//     echo json_encode([
//       'message' => 'No treatments for this vet'
//     ]);
//     exit;
//   }

//   echo json_encode([
//     'data' => $treatments
//   ]);
// });

// //GET treatments by pet id 
// router('GET', '^/treatments/byPet/(?<id>\d+)$', function ($petId) {
//   $treatment = new Treatment($GLOBALS['DATABASE']);
//   // $protect = new Protect($GLOBALS['DATABASE']);
//   // $protect->validate();
//   $treatments = $treatment->getTreatmentsByPet((int) $petId['id']);

//   if (!$treatments) {
//     http_response_code(404);
//     echo json_encode([
//       'message' => 'No treatments for this pet'
//     ]);
//     exit;
//   }

//   echo json_encode([
//     'data' => $treatments
//   ]);
// });

// //GET treatments by id
// router('GET', '^/treatments/byId/(?<id>\d+)$', function ($treatmentId) {
//   $treatment = new Treatment($GLOBALS['DATABASE']);
//   $protect = new Protect($GLOBALS['DATABASE']);
//   $protect->validate();
//   $treatments = $treatment->getTreatmentsById((int) $treatmentId['id']);

//   if (!$treatments) {
//     http_response_code(404);
//     echo json_encode([
//       'message' => 'No treatments for this id'
//     ]);
//     exit;
//   }

//   echo json_encode([
//     'data' => $treatments
//   ]);
// });

// //POST update an appointment
// router('PUT', '^/treatments/update/(?<id>\d+)$', function ($treatmentId) {
//   $data = json_decode(file_get_contents('php://input'), true);

//   $protect = new Protect($GLOBALS['DATABASE']);
//   $protect->validateVet();

//   $treatment = new Treatment($GLOBALS['DATABASE']);
//   $treatment->validateUpdateData($data, (int) $treatmentId['id']);
//   $treatment->updateTreatment($data, (int) $treatmentId['id']);
// });