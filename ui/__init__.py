from django.shortcuts import render_to_response

def test(req):
    return render_to_response('test.jade')