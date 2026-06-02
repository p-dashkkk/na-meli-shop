<?php
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/LogModel.php';

class UserController {
    private $userModel;
    private $logModel;

    public function __construct() {
        $this->userModel = new UserModel();
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

    public function register() {
        $this->setCorsHeaders();

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email and password are required']);
            return;
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            return;
        }

        if (strlen($data['password']) < 4) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 4 characters']);
            return;
        }

        $age = isset($data['age']) ? (int)$data['age'] : null;

        $user = $this->userModel->create(
            $data['name'],
            $data['email'],
            $age,
            $data['password']
        );

        if ($user === false) {
            http_response_code(409);
            echo json_encode(['error' => 'User with this email already exists']);
            return;
        }

        $this->logModel->write(
            'REGISTER',
            'User: ' . $user['email']
        );

        unset($user['password']);

        http_response_code(201);
        echo json_encode([
            'message' => 'User registered successfully',
            'user' => $user
        ]);
    }

    public function login() {
        $this->setCorsHeaders();
        $this->startSession();

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        $user = $this->userModel->verifyLogin(
            $data['email'],
            $data['password']
        );

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];

        $this->logModel->write(
            'LOGIN',
            'User: ' . $user['email']
        );

        unset($user['password']);

        echo json_encode([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }

    public function getAllUsers() {
        $this->setCorsHeaders();
        $this->startSession();

        if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied. Admin only.']);
            return;
        }

        $users = $this->userModel->getAll();

        foreach ($users as &$user) {
            unset($user['password']);
        }

        echo json_encode($users);
    }

    public function getUserById($id) {
        $this->setCorsHeaders();
        $this->startSession();

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        if ($_SESSION['user_id'] != $id && $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }

        $user = $this->userModel->getById($id);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        unset($user['password']);

        echo json_encode($user);
    }

    public function deleteUser($id) {
        $this->setCorsHeaders();
        $this->startSession();

        if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }

        if ($_SESSION['user_id'] == $id) {
            http_response_code(400);
            echo json_encode(['error' => 'You cannot delete yourself']);
            return;
        }

        $user = $this->userModel->getById($id);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        $this->userModel->delete($id);

        $this->logModel->write(
            'DELETE_USER',
            'Admin: ' . $_SESSION['user_name'] .
            '; Deleted: ' . $user['email']
        );

        echo json_encode(['message' => 'User deleted']);
    }
}