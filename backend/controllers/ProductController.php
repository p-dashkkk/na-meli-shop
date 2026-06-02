<?php
require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../models/LogModel.php';

class ProductController {
    private $productModel;
    private $logModel;
    
    public function __construct() {
        $this->productModel = new ProductModel();
        $this->logModel = new LogModel();
    }

    private function setCorsHeaders() {
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header('Access-Control-Allow-Credentials: true');
        header('Content-Type: application/json');
    }

    private function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            session_start();
        }
    }
    
    public function getAllProducts() {
        $this->setCorsHeaders();
        $products = $this->productModel->getAll();
        echo json_encode($products);
    }
    
    public function updateStock($id) {
        $this->setCorsHeaders();
        $this->startSession();
        
        if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied. Admin only.']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['inStock']) || !is_bool($data['inStock'])) {
            http_response_code(400);
            echo json_encode(['error' => 'inStock (boolean) is required']);
            return;
        }
        
        $result = $this->productModel->updateStock($id, $data['inStock']);
        if (!$result) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        $this->logModel->write(
            'STOCK_CHANGE',
            'Admin: ' . $_SESSION['user_name'] .
            '; Product ID: ' . $id .
            '; New status: ' . ($data['inStock'] ? 'true' : 'false')
        );
        
        echo json_encode(['message' => 'Product stock updated successfully']);
    }
}