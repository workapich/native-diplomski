<?php

require_once __DIR__ . '/../controllers/History.php';

router('GET', '^/history$', function () {
  $history = new History($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();

  // Check if a 'limit' parameter is set in the URL query string
  $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

  // Fetch history data with or without a limit
  echo json_encode($history->getAll($limit));
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