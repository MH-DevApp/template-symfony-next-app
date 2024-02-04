<?php

namespace App\Controller;

use App\Entity\TokenSession;
use App\Entity\User;
use App\Repository\TokenSessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/signup', name: 'signup', methods: ['POST'])]
    public function signup(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em
    ): JsonResponse
    {
        $newUser = $serializer->deserialize(
            $serializer->serialize(
                [
                    ...$request->toArray()
                ], 'json'
            ),
            User::class,
            'json'
        );

        $errors = $validator->validate($newUser);

        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'message' => 'There was an error creating your account.',
                'errors' => array_map(static function($error) {
                    return [
                        'field' => $error->getPropertyPath(),
                        'message' => $error->getMessage()
                    ];
                }, iterator_to_array($errors))
            ]);
        }

        $newUser
            ->setPassword(
                $passwordHasher->hashPassword(
                    $newUser,
                    $newUser->getPassword()
                ))
            ->setCreatedAt(new \DateTimeImmutable());

        $em->persist($newUser);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Your account has been created. You can now log in.'
        ]);
    }

    #[Route('/signout', name: 'signout', methods: ['POST'])]
    public function signOut(
        Request $request,
        TokenSessionRepository $tokenSessionRepository,
        EntityManagerInterface $em
    ): JsonResponse
    {
        if ($request->headers->get('Authorization')) {
            $token = str_replace(
                "Bearer ",
                "",
                $request->headers->get('Authorization')
            );

            $tokenSession = $tokenSessionRepository->findOneBy([
                "tokenValue" => $token
            ]);

            if (
                $tokenSession &&
                $tokenSession->getExpiratedAt() > new \DateTimeImmutable('now') &&
                $this->getUser() === $tokenSession->getUserLink()
            ) {
                $tokenSession->setExpiratedAt((new \DateTimeImmutable('now'))->modify('-1 second'));
                $em->flush();

                return $this->json([
                    'success' => true,
                    'message' => 'You are now logged out.'
                ]);
            }
        }

        return $this->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], Response::HTTP_UNAUTHORIZED);
    }

    #[Route('/current-user', name: 'current-user', methods: ['GET'])]
    public function getCurrentUser(
        Request $request,
        TokenSessionRepository $tokenSessionRepository,
        SerializerInterface $serializer
    ): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'You are not logged in.',
                'data' => [
                    'user' => null
                ]
            ], Response::HTTP_UNAUTHORIZED);
        }

        $tokenValue = null;

        if ($request->headers->has("x-session-id")) {
            $tokenSession = $tokenSessionRepository->findOneBy(["id" => $request->headers->get("x-session-id")]);

            if ($tokenSession) {
                $tokenValue = explode('.', $tokenSession->getTokenValue())[1];
            }
        }

        $response = $serializer->serialize(
            [
                'success' => true,
                'message' => 'You are logged in.',
                'data' => [
                    'user' => $user,
                    'tokenValue' => $tokenValue
                ]
            ],
            'json',
            [
                'groups' => 'user:read'
            ]
        );

        return new JsonResponse($response, json: true);
    }


    #[Route('/refresh-token', name: 'refresh-token', methods: ['POST'])]
    public function refreshToken(
        Request $request,
        JWTTokenManagerInterface $JWTTokenManager,
        EntityManagerInterface $em,
        TokenSessionRepository $tokenSessionRepository,
    ): JsonResponse
    {
        $headerAuthorization = $request->headers->get('Authorization');

        if ($headerAuthorization && str_contains($headerAuthorization, 'Bearer') && $this->getUser()) {
            /** @var User $user */
            $user = $this->getUser();

            $token = explode(' ', $request->headers->get('Authorization'))[1];

            $tokenSession = $tokenSessionRepository->findOneBy([
                'tokenValue' => $token
            ]);

            $refreshTokenTick = $this->getParameter('REFRESH_TOKEN_TICK');

            if ($token && $tokenSession) {
                if ($tokenSession->getCreatedAt()->modify("+$refreshTokenTick second") <= new \DateTimeImmutable('now')) {
                    $tokenSession->setExpiratedAt((new \DateTimeImmutable('now'))->modify('-1 second'));

                    $newToken = $JWTTokenManager->create($user);
                    $newTokenParse = json_decode(base64_decode(explode('.', $newToken)[1], true), true);

                    $newTokenSession = (new TokenSession())
                        ->setUserLink($user)
                        ->setTokenValue($newToken)
                        ->setCreatedAt((new \DateTimeImmutable())->setTimestamp($newTokenParse['iat']))
                        ->setExpiratedAt((new \DateTimeImmutable())->setTimestamp($newTokenParse['exp']));

                    $em->persist($newTokenSession);
                    $em->flush();

                    return $this->json([
                        'success' => true,
                        'message' => 'You have been refresh token !',
                        'data' => [
                            'token' => $newTokenSession->getId(),
                            'tokenValue' => explode('.',$newToken)[1]
                        ]
                    ]);
                }

                return $this->json([
                    'success' => true,
                    'message' => 'Not yet time to refresh token !',
                ]);
            }
        }

        return $this->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ]);
    }
}
