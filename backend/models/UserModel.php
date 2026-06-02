<?php
class UserModel {
    private $dataFile;

    public function __construct() {
        $this->dataFile = __DIR__ . '/../data/users.json';
    }

    private function loadUsers() {
        if (!file_exists($this->dataFile)) {
            return [];
        }
        $json = file_get_contents($this->dataFile);
        return json_decode($json, true);
    }

    private function saveUsers($users) {
        file_put_contents($this->dataFile, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public function getAll() {
        return $this->loadUsers();
    }

    public function getById($id) {
        $users = $this->loadUsers();
        foreach ($users as $user) {
            if ($user['id'] == $id) {
                return $user;
            }
        }
        return null;
    }

    public function getByEmail($email) {
        $users = $this->loadUsers();
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                return $user;
            }
        }
        return null;
    }

    public function create($name, $email, $age, $password) {
        $users = $this->loadUsers();
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                return false;
            }
        }
        $newId = count($users) > 0 ? max(array_column($users, 'id')) + 1 : 1;
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $newUser = [
            'id' => $newId,
            'name' => $name,
            'email' => $email,
            'age' => $age,
            'password' => $hashedPassword,
            'role' => 'user'
        ];
        $users[] = $newUser;
        $this->saveUsers($users);
        return $newUser;
    }

    public function verifyLogin($email, $password) {
        $user = $this->getByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return null;
    }

    public function delete($id) {
        $users = $this->loadUsers();

        $users = array_filter(
            $users,
            fn($user) => $user['id'] != $id
        );

        $this->saveUsers(array_values($users));
        return true;
    }
}