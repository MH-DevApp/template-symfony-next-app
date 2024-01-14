<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\SerializerInterface;

class LexikJWTListener
{
    public function __construct(private SerializerInterface $serializer)
    {
    }

    /**
     * @throws \JsonException
     */
    public function onJWTFailureResponse($event): void
    {
        $event->getResponse()->setContent(
            json_encode([
                'success' => false,
                'codeError' => 'SessionError',
                'message' => 'Your session has not valid. Please log in again.'
            ], JSON_THROW_ON_ERROR)
        );
    }

    public function onAuthenticationFailureResponse($event): void
    {
        $response = new JsonResponse([
            'success' => false,
            'message' => 'Authentication failed.',
            'codeError' => 'AuthenticationError',
            'errors' => [
                [
                    "field" => "root",
                    "message" => "Invalid credentials."
                ]
            ]
        ], 401);

        $event->setResponse($response);
    }

    public function onAuthenticationSuccessResponse($event): void
    {
        if (!$event->getUser() instanceof UserInterface) {
            return;
        }

        $event->setData(
            [
                'success' => true,
                'message' => 'Authentication success.',
                'token' => $event->getData()['token'],
                'data' => [
                    'user' => $this->serializer->normalize($event->getUser(), null, ['groups' => 'user:read'])
                ]
            ]
        );
    }
}