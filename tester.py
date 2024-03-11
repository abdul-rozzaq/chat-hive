import sys
sys.dont_write_bytecode = True

# Django specific settings
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()



from project.models import Message, User
from django.db.models import Q
from project.serializers import UserSerializer

receiver = User.objects.get(username='murodulla_2007')
user = User.objects.get(username='admin')


'''
{
    'sender': 1,
    'receiver': 9,
    'messages': [
        {
            'pk': 12,
            'text': 'asdas',
            'created_at': '21:18'
        },
    ]
}

'''

msgs = []








for msg in queryset:
    print(msg.sender.username)
    print(msg.pk, msg.text)
    
    minute = msg.created_at.minute

    if len(msgs) == 0 or msgs[-1]['sender']['id'] != msg.sender.pk or msgs[-1]['sender']['id'] == msg.sender.pk and minute - int(msgs[-1]['messages'][-1]['created_at'].split(':')[-1]) > 3:
        msgs.append(
            {
                'sender': UserSerializer(msg.sender).data,
                'receiver': UserSerializer(msg.receiver).data,
                'messages': [
                    {
                        'pk': msg.pk,
                        'text': msg.text,
                        'created_at': msg.created_at.strftime('%H:%M')
                    },
                ]
            }
        )     
    else:
        msgs[-1]['messages'].append(
            {
                'pk': msg.pk,
                'text': msg.text,
                'created_at': msg.created_at.strftime('%H:%M')
            }
        )
    
print()


for x in msgs:
    print(x['sender']['username'])
    
    for y in x['messages']:
        print(y)
    
    print()