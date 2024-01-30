<?php

namespace Scripts;

use Scripts\Utils\CommandMessage\LineMessage;
use Scripts\Utils\CommandMessage\Message;
use Symfony\Component\Uid\Uuid;

require_once __DIR__ . '/../vendor/autoload.php';

$SERVER_API_KEY = str_replace("-", "", Uuid::v5(Uuid::v4(), ""));

$message = new Message();
$message
    ->setTitle(
        new LineMessage("Generating SERVER_API_KEY", LineMessage::COLORS["default"])
    )
    ->addLineToBody(
        new LineMessage(
            $SERVER_API_KEY,
            LineMessage::COLORS["green"]
        )
    )
;
$message->render();