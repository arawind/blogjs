---
layout: post
title: Resources for setting up DNS for a VPN
tags: dns, bind dns, vpn, open vpn
---

Resources for setting up DNS for a VPN
----------------------
This post is a log of all the resources I needed so that I don't have to search for them again

Assuming you have a OpenVPN, (or take-a-look-[here](https://vpntips.com/how-to-setup-a-vpn-server/))

Set up a DNS like [here](https://www.digitalocean.com/community/tutorials/how-to-configure-bind-as-a-caching-or-forwarding-dns-server-on-ubuntu-14-04)

And then you'll need this on your server
`tcpdump -vvv -s 0 -l -n port 53 -i tun0` [Source](http://jontai.me/blog/2011/11/monitoring-dns-queries-with-tcpdump/) to see your dns requests

And this in your `server.conf` of openvpn
`push "dhcp-option DNS <ip-at-which-dns-is-running>"`

And don't forget to run `dig google.com` or `dig your-own-private-grave.in-your-own.subnet` on your client

That should do it.
