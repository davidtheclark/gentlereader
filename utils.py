import re

def ignore_articles(string):
    """ Takes a string and returns it with initial articles excluded.
    Used for alphabetical sorting. """
    str_low = string.lower()
    if str_low.startswith("the "):
        return string[4:]
    elif str_low.startswith("an "):
        return string[3:]
    elif str_low.startswith("a "):
        return string[2:]
    else:
        return string
    
def dumb_to_smart_quotes(string):
    """ Takes a string and returns it with dumb quotes, single and double,
    replaced with smart quotes. """
    # Find dumb double quotes coming directly after letters or punctuation,
    # and replace them with right double quotes. 
    string = re.sub(r'([a-zA-Z0-9.,?!;:])"', r'\1&#8221;', string)
    # Find any remaining dumb double quotes and replace them with
    # left double quotes. 
    string = string.replace('"', '&#8220;')
    # Reverse: Find any SMART quotes that have been (mistakenly) placed around HTML
    # attributes (following =) and replace them with dumb quotes.
    string = re.sub(r'=&#8220;(.*?)&#8221;', r'="\1"', string)
    # Follow the same process with dumb/smart single quotes
    string = re.sub(r"([a-zA-Z0-9.,?!;:])'", r'\1&#8217;', string)
    string = string.replace("'", '&#8216;')
    string = re.sub(r'=&#8216;(.*?)&#8217;', r"='\1'", string)
    return string