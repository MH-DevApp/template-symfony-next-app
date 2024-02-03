<?php

namespace App\EventListener;

use App\Repository\TokenSessionRepository;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class RequestListener
{
    public function __construct(
        private readonly ContainerBagInterface $container,
        private readonly TokenSessionRepository $tokenSessionRepository
    )
    {
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function onRequestListener(RequestEvent $event): void
    {
        if ($event->isMainRequest()) {
            if ($this->container->has("SERVER_API_KEY") && $this->container->get("SERVER_API_KEY") !== null) {
                if (
                    !$event->getRequest()->headers->has("x-api-server-key") ||
                    $event->getRequest()->headers->get("x-api-server-key") !== $this->container->get("SERVER_API_KEY")
                ) {
                    $event->setResponse(
                        new JsonResponse([
                            'success' => false,
                            'message' => 'Communication with the server failed.'
                        ], Response::HTTP_UNAUTHORIZED)
                    );
                }
            }

            if ($event->getRequest()->headers->has("x-session-id")) {
                $tokenSession = $this->tokenSessionRepository->findOneBy(["id" => $event->getRequest()->headers->get("x-session-id")]);

                if ($tokenSession) {
                    $event->getRequest()->headers->set("Authorization", "Bearer " . $tokenSession->getTokenValue());
                }
            }
        }
    }
}
