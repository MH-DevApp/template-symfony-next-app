<?php

namespace Scripts\Utils\CommandMessage;

class LineMessage {
    public const COLORS = [
        'default' => "\033[0m",
        'green' => "\033[32m",
        'red' => "\033[31m",
        'yellow' => "\033[33m",
        'orange' => "\033[38;5;208m",
        'gray' => "\033[38;5;240m",
    ];

    public function __construct(
        private readonly string  $text,
        private readonly ?string $colorStart = self::COLORS['default'],
        private readonly ?string $colorEnd = self::COLORS['default']
    )
    {
    }

    public function getLength(): int
    {
        return strlen($this->text);
    }

    public function getText(): string
    {
        return $this->colorStart . $this->text . $this->colorEnd;
    }
}
