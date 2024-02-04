<?php

namespace Scripts\Utils\CommandMessage;

class Message {
    private int $spacing;
    private ?LineMessage $title = null;
    /**
     * @var LineMessage[]|null $body
     */
    private array $body;

    public function __construct(?int $spacing = 5)
    {
        $this->body = [];
        $this->spacing = $spacing;
    }

    public function setTitle(LineMessage $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function addLineToBody(LineMessage $line): static
    {
        $this->body[] = $line;
        return $this;
    }

    public function render(): void
    {
        if (count($this->body) === 0) {
            echo PHP_EOL .
                LineMessage::COLORS["red"] .
                "Need one line in body for render output message." .
                LineMessage::COLORS["default"] . PHP_EOL;
            return;
        }

        echo PHP_EOL;

        if ($this->title) {
            echo $this->getFullLine() . PHP_EOL;
            echo $this->getLineWithText($this->title) . PHP_EOL;
        }

        echo $this->getFullLine() . PHP_EOL;
        echo $this->getFullLine(true) . PHP_EOL;

        foreach ($this->body as $line) {
            echo $this->getLineWithText($line) . PHP_EOL;
        }

        echo $this->getFullLine(true) . PHP_EOL;
        echo $this->getFullLine() . PHP_EOL;

        echo PHP_EOL;
    }

    private function getMaxLength(): int
    {
        $maxLength = 0;

        if ($this->title !== null) {
            $maxLength = $this->title->getLength();
        }

        foreach ($this->body as $line) {
            $maxLength = max($line->getLength(), $maxLength);
        }

        return $maxLength + ($this->spacing * 2);
    }

    private function getFullLine(bool $empty = false): string
    {
        $maxLength = $this->getMaxLength();
        $line = '';

        for ($i = 0; $i < $maxLength; $i++) {
            if (!$empty || $i === 0 || $i === $maxLength -1) {
                $line .= "=";
            } else {
                $line .= " ";
            }
        }

        return $line;
    }

    private function getLineWithText(LineMessage $line): string
    {
        $maxLength = $this->getMaxLength();
        $lineText = $line->getText();
        $lengthHalfLine = (int)floor(($maxLength - $line->getLength()) / 2);

        for ($i = 0; $i < $lengthHalfLine; $i++) {
            if ($i === $lengthHalfLine - 1) {
                if ($maxLength - ($lengthHalfLine * 2) > $line->getLength()) {
                    $lineText .= " ";
                }
                $lineText = "=" . $lineText . "=";
            } else {
                $lineText = " " . $lineText . " ";
            }
        }

        return $lineText;
    }
}
