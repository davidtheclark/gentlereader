from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from gentlereader.forms import ContactForm


def contact(req):
    auto_subject = req.GET.get('subject', '')
    go_to_captcha = False
    if req.method == 'POST':  # If the form has been submitted...
        form = ContactForm(req.POST)  # A form bound to the POST data
        if form.is_valid():  # All validation rules pass
            subject = form.cleaned_data['subject']
            sender = form.cleaned_data['sender']
            message = '(From ' + sender + ') ' + form.cleaned_data['message']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = ['david@thegentlereader.net']
            if cc_myself:
                recipients.append(sender)
            from django.core.mail import send_mail
            send_mail(subject, message, sender, recipients)
            return HttpResponseRedirect('/contact/thanks/')  # Redirect after POST
        else:
            go_to_captcha = True
    else:
        form = ContactForm(initial={
            'subject': auto_subject
        })  # An unbound form'
    return render_to_response('contact.html', {
        'form': form,
        'go_to_captcha': go_to_captcha
    }, context_instance=RequestContext(req))


def thanks(req):
    return render_to_response('thanks.html', {}, context_instance=RequestContext(req))
