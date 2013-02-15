from django import forms
from captcha.fields import ReCaptchaField

class ContactForm(forms.Form):
    sender = forms.EmailField(required=False)
    cc_myself = forms.BooleanField(required=False)
    subject = forms.CharField()
    message = forms.CharField(widget=forms.widgets.Textarea())
    captcha = ReCaptchaField()
