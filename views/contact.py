from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from gentlereader.forms import ContactForm


def contact(req):
    auto_subject = req.GET.get('subject')

    if req.method == 'POST':  # If the form has been submitted...
        form = ContactForm(req.POST)  # A form bound to the POST data
        if form.is_valid():  # All validation rules pass
            subject = form.cleaned_data['subject']
            message = '(From ' + form.cleaned_data['sender'] + ') ' + form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = ['dave@projectegghead.com']
            if cc_myself:
                recipients.append(sender)
            from django.core.mail import send_mail
            send_mail(subject, message, sender, recipients)
            return HttpResponseRedirect('/thanks/')  # Redirect after POST
    else:
        form = ContactForm()  # An unbound form'
    return render_to_response('contact.html', {
        'form': form,
        'auto_subject': auto_subject
    }, context_instance=RequestContext(req))


def thanks(req):
    return render_to_response('thanks.html', {}, context_instance=RequestContext(req))
