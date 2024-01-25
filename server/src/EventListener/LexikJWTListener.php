<?php

namespace App\EventListener;

use App\Entity\TokenSession;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTFailureEventInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\SerializerInterface;

class LexikJWTListener
{
    public function __construct(private SerializerInterface $serializer, private EntityManagerInterface $em, private JWTTokenManagerInterface $JWTManager, private RequestStack $requestStack)
    {
    }

    /**
     * @throws \JsonException
     */
    public function onJWTFailureResponse(JWTFailureEventInterface $event): void
    {
        $event->getResponse()->setContent(
            json_encode([
                'success' => false,
                'codeError' => 'SessionError',
                'message' => 'Your session has not valid. Please log in again.'
            ], JSON_THROW_ON_ERROR)
        );
    }

    public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event): void
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

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        if (!$event->getUser() instanceof UserInterface) {
            return;
        }

        /** @var User $user */
        $user = $event->getUser();

        $token = $event->getData()['token'];
        $parseToken = $this->JWTManager->parse($token);

        $tokenSession = new TokenSession();
        $tokenSession
            ->setTokenValue($token)
            ->setUserLink($user)
            ->setCreatedAt((new \DateTimeImmutable())->setTimestamp($parseToken['iat']))
            ->setExpiratedAt((new \DateTimeImmutable())->setTimestamp($parseToken['exp']));

        $this->em->persist($tokenSession);
        $this->em->flush();

        $event->setData(
            [
                'success' => true,
                'message' => 'Authentication success.',
                'token' => $token,
                'data' => [
                    'user' => $this->serializer->normalize($event->getUser(), 'json', ['groups' => 'user:read'])
                ]
            ]
        );
    }

    public function onJWTDecoded(JWTDecodedEvent $event): void
    {
        $headerAuthorization = $this->requestStack->getCurrentRequest()->headers->get('Authorization');

        if ($headerAuthorization) {
            if (!str_contains($headerAuthorization, 'Bearer')) {
                $event->markAsInvalid();
            }

            $token = explode(' ', $this->requestStack->getCurrentRequest()->headers->get('Authorization'))[1];
            $tokenSessionRepository = $this->em->getRepository(TokenSession::class);

            $tokenSession = $tokenSessionRepository->findOneBy([
                "tokenValue" => $token
            ]);

            if (
                !$token ||
                !$tokenSession ||
                $tokenSession->getExpiratedAt() <= new \DateTimeImmutable('now')
            ) {
                $event->markAsInvalid();
            }
        }
    }
}
