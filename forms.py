from django import forms
from captcha.fields import ReCaptchaField
from django.forms.widgets import TextInput


class EmailInput(TextInput):
    input_type = 'email'


class ContactForm(forms.Form):
    sender = forms.EmailField(
        widget=EmailInput(attrs={
            'required': 'true'
        })
    )
    cc_myself = forms.BooleanField(
        required=False
    )
    subject = forms.CharField(
        required=False,
        widget=TextInput(attrs={
            'autofocus': 'true'
        })
    )
    message = forms.CharField(
        widget=forms.widgets.Textarea(attrs={
            'required': 'true'
        })
    )
    captcha = ReCaptchaField(
        attrs={'theme': 'white'},
        error_messages={
            'captcha_invalid': "You failed the Human Test. Summon your human spirit and try again.",
            'required': 'You cannot bypass the Human Test. Or are you inhuman?'
        }
    )
