# Generated by Django 5.0.6 on 2024-05-19 18:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('taskManager', '0005_alter_task_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ('-priority', 'due_date', 'progress')},
        ),
    ]
