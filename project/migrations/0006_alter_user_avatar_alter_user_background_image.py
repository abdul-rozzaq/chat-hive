# Generated by Django 4.2.7 on 2024-03-03 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0005_user_background_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='default-user.avif', upload_to='avatar'),
        ),
        migrations.AlterField(
            model_name='user',
            name='background_image',
            field=models.ImageField(default='default-user.avif', upload_to='background_images/'),
        ),
    ]
