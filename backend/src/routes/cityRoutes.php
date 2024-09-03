<?php

require_once __DIR__ . '/../controllers/City.php';

//GET all citys
router('GET', '^/city$', function () {
  $city = new City($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  echo json_encode($city->getAll());
});
//GET all citys that are active
router('GET', '^/city/active$', function () {
  $city = new City($GLOBALS['DATABASE']);
  $protect = new Protect($GLOBALS['DATABASE']);
  $protect->validate();
  echo json_encode($city->getCityAvailable());
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