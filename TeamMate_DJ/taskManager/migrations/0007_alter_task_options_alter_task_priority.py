# Generated by Django 5.0.6 on 2024-05-20 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskManager', '0006_alter_task_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ('due_date', 'priority', 'progress')},
        ),
        migrations.AlterField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[(3, 'High'), (2, 'Medium'), (1, 'Low')], default='High', max_length=6),
        ),
    ]
