<?php

require_once __DIR__ . '/../controllers/History.php';
router('GET', '^/history$', function () {
  $history = new History($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();

  // Check if 'limit' and 'offset' parameters are set in the URL query string
  $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
  $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0; // Default to 0 if no offset is provided

  // Fetch history data with limit and offset for pagination
  echo json_encode($history->getAll($limit, $offset));
});



//POST creating a treatment
router('POST', '^/history/addPayment$', function () {
  $data = json_decode(file_get_contents('php://input'), true);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  $history = new History($GLOBALS['DATABASE']);
  $history->addPayment($data);
});



//GET city by id
router('GET', '^/city/(?<id>\d+)$', function ($params) {
  $city = new City($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();

  $data = $city->getById($params['id'] ?? null);
  echo json_encode([
    'data' => $data,
  ]);
});

router('GET', '^/city/search$', function () {
  $city = new City($GLOBALS['DATABASE']);
  // $protect = new Protect($GLOBALS['DATABASE']);
  // $protect->validate();
  $query = $_GET['query'] ?? '';
  $data= $city->searchCities($query);
  echo json_encode([
    'data' => $data,
  ]);
});

router('GET', '^/city/exact$', function () {
  $city = new City($GLOBALS['DATABASE']);
  // $protect = new Protect($GLOBALS['DATABASE']);
  // $protect->validate();
  $exact = $_GET['zones'] ?? '';
  $data= $city->searchZones($exact);
  echo json_encode([
    'data' => $data,
  ]);
});