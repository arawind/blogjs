---
layout: post
title: x264 swscale
tags: archived-from-wp-backup, notes
createdAt: 2013-09-30 18:06:42
layout: post
---

x264 swscale
------------
Trying to use <a href="https://github.com/slederer/DASHEncoder" target="_blank">DASHEncoder</a>, ran into several problems - the major one being my arch's x264 version not compiled with swscale. Three hours of vigorous searching in archlinux packages, AUR &amp; videolan's x264 repositories, and many 'make's later, the exhilaration I felt in finding the perfect configuration &amp; PKGBUILD is beyond words to describe.  Even after this, my ffmpeg couldn't load the library because of the difference in the version it uses and the one that was just installed. I had two options now, upgrade ffmpeg by compiling from the git source and search for it's configuration or create a symlink from the new version to the old one. Took me no time to decide.

Now to think that it was going to be a smooth ride after all these troubles, not a Disney movie, innit? The DASHEncoder code was written 2 years ago, and GPAC during this time updated it's MP4Box to newer standards - standards which again, the VLC DASH extension doesn't follow. So the MPD that's now created is nothing more than gibberish to the DASHEncoder and fails parsing it. My choices are again two - rewrite the parser code to accommodate the new standards (and replacing the new tags with their older versions) or downgrade the GPAC version to the one used by the author. :-/