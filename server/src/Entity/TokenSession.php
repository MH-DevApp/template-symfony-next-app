<?php

namespace App\Entity;

use App\Repository\TokenSessionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Component\Uid\UuidV6;

#[ORM\Entity(repositoryClass: TokenSessionRepository::class)]
class TokenSession
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[ORM\Column(type: 'uuid', unique: true)]
    private ?UuidV6 $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $tokenValue = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $userLink = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $expiratedAt = null;

    public function getId(): ?UuidV6
    {
        return $this->id;
    }

    public function getTokenValue(): ?string
    {
        return $this->tokenValue;
    }

    public function setTokenValue(string $tokenValue): static
    {
        $this->tokenValue = $tokenValue;

        return $this;
    }

    public function getUserLink(): ?User
    {
        return $this->userLink;
    }

    public function setUserLink(?User $userLink): static
    {
        $this->userLink = $userLink;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getExpiratedAt(): ?\DateTimeImmutable
    {
        return $this->expiratedAt;
    }

    public function setExpiratedAt(\DateTimeImmutable $expiratedAt): static
    {
        $this->expiratedAt = $expiratedAt;

        return $this;
    }
}
