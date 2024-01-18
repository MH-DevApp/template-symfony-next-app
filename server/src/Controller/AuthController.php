<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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
        $content = $serializer->serialize(
            [
                'class_name' => 'User',
                ...$request->toArray()
            ], 'json'
        );

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

    #[Route('/current-user', name: 'current-user', methods: ['GET'])]
    public function getCurrentUser(
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

        $response = $serializer->serialize(
            [
                'success' => true,
                'message' => 'You are logged in.',
                'data' => [
                    'user' => $user
                ]
            ],
            'json',
            [
                'groups' => 'user:read'
            ]
        );

        return new JsonResponse($response, json: true);
    }
}
