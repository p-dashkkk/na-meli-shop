<?php

class ProductModel {

    private $dataFile;

    public function __construct() {
        $this->dataFile = __DIR__ . '/../data/products.json';
    }

    public function getAll() {

        if (!file_exists($this->dataFile)) {
            return [];
        }

        $json = file_get_contents($this->dataFile);

        return json_decode($json, true) ?: [];
    }

    public function getById($id) {

        $products = $this->getAll();

        foreach ($products as $product) {

            if ($product['id'] == $id) {
                return $product;
            }
        }

        return null;
    }

    public function updateStock($id, $inStock) {

        $products = $this->getAll();

        $found = false;

        foreach ($products as &$product) {

            if ($product['id'] == $id) {

                $product['inStock'] = $inStock;
                $found = true;
                break;
            }
        }

        if ($found) {

            file_put_contents(
                $this->dataFile,
                json_encode(
                    $products,
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                )
            );

            return true;
        }

        return false;
    }
}