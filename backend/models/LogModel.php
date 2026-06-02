<?php

class LogModel
{
    private $logFile;

    public function __construct()
    {
        $this->logFile = __DIR__ . '/../logs/app.log';
    }

    public function write($action, $message)
    {
        $date = date('Y-m-d H:i:s');

        $record =
            "[" . $date . "] " .
            $action . " | " .
            $message . PHP_EOL;

        file_put_contents(
            $this->logFile,
            $record,
            FILE_APPEND
        );
    }
}