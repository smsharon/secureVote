import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    """
    Factory for generating test users.
    """

    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")

    email = factory.Sequence(lambda n: f"user{n}@example.com")

    is_verified = True

    role = User.Role.VOTER

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        """
        Sets hashed password properly.
        """

        password = extracted or "StrongPass123!"

        obj.set_password(password)

        obj.save()
