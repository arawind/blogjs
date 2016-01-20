---
layout: post
title: Alsa systemd PolKit Lightdm
tags: archived-from-wp-backup, notes
createdAt: 2013-09-08 12:13:19
layout: post
---

Alsa systemd PolKit Lightdm
---------------------------
After what seemed as a regular update, I found my sound not working.

aplay -l returned "no soundcards found" while lspci and lsmod said everything was alright. sudo aplay -l returned the right output and left me thinking about permissions. A quick search on google asked me to add myself to the "audio" group but then I found that my "Suspend" button has been disabled for some reason. The problem lied not with alsa but with systemd? Tried searching for a problem in autostarting systemd --user process, but nope - it was all fine.

Then I remembered seeing a warning during the update saying polkit has been deprecated for GNOME, and tried installing lxpolkit, autostarting polkit via xdg/autostart, but nothing worked

Meanwhile, my lightdm update created a new conf file and I set back my previous preferences except for one. It started the lightdm process in tty1 as opposed to my previous configuration where it started in tty7. I am used to switching to tty1 for rescue and I wanted the previous behavior back, so I changed the "minimum-vt" option from 1 to 7.

Next login, everything fixed :-/