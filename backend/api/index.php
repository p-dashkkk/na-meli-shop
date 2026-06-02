<?php

header('Content-Type: application/json; charset=utf-8');

$allowed_origin = 'http://localhost:5173';

header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/ProductController.php';

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if (preg_match('/\/api\/([^?]+)/', $requestUri, $matches)) {
    $uri = trim($matches[1], '/');
} else {
    $uri = '';
}

$userController = new UserController();
$productController = new ProductController();

try {

    if ($uri === 'register' && $method === 'POST') {
        $userController->register();
    }

    elseif ($uri === 'login' && $method === 'POST') {
        $userController->login();
    }

    elseif ($uri === 'users' && $method === 'GET') {
        $userController->getAllUsers();
    }

    elseif (preg_match('/^users\/(\d+)$/', $uri, $matches) && $method === 'DELETE') {
        $userController->deleteUser($matches[1]);
    }

    elseif (preg_match('/^users\/(\d+)$/', $uri, $matches) && $method === 'GET') {
        $userController->getUserById($matches[1]);
    }

    elseif ($uri === 'products' && $method === 'GET') {
        $productController->getAllProducts();
    }

    elseif (preg_match('/^products\/(\d+)\/stock$/', $uri, $matches) && $method === 'PATCH') {
        $productController->updateStock($matches[1]);
    }

    else {
        http_response_code(404);
        echo json_encode([
            'error' => "Endpoint not found",
            'uri' => $uri
        ]);
    }

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}