from django import forms
from captcha.fields import ReCaptchaField

class ContactForm(forms.Form):
    sender = forms.EmailField(required=False)
    cc_myself = forms.BooleanField(required=False)
    subject = forms.CharField()
    message = forms.CharField(widget=forms.widgets.Textarea())
    captcha = ReCaptchaField(
        public_key='6LdeEN0SAAAAAG2rSR1WrF4SkXsYHqG5N-sFn3z6',
        private_key='6LdeEN0SAAAAAMMZCm1C_KcW5JqkRUjaWKUx2bD5',
    )
