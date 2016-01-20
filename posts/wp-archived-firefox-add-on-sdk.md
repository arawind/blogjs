---
layout: post
title: Firefox Add-on SDK
tags: archived-from-wp-backup, add-on-sdk, firefox, python, virtualenv
createdAt: 2014-03-13 11:40:16
layout: post
---

Firefox Add-on SDK
------------------
The Add-on SDK uses python2 and uses 'python' as the executable in all it's scripts - this obviously causes trouble when your /usr/bin/python points to python3.*, and you don't want to change the link to point to python2 as all your other scripts might be using this link.

After searching for a while, I came across <a title="Opens in a new tab" href="http://stackoverflow.com/questions/7237415/python-2-instead-of-python-3-as-the-temporary-default-python" target="_blank">this post</a> (where else but on stackoverflow) which explains how to use virtualenv to create a path to python2.7. It doesn't help much because your virtual environment is again overridden by the virtual environment created by the Add-on SDK.

A workaround I used to make it work is to create a virtualenv directory using the command  shown in the aforementioned post and  copy pip*, easy-install* and python* binaries from the temp-python/bin directory and put them in the addon-sdk/bin directory.

'source bin/activate' and et voilà!