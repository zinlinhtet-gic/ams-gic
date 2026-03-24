<?php

namespace App\Exceptions;

use Exception;
use App\Util\Message;

class ClientTenantNotFound extends Exception
{
    //
    public function __construct($message = null)
    {
        $message = $message ?? Message::$messages['eb001'];
        parent::__construct($message);
    }
}
