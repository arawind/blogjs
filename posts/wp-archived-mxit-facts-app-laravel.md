---
layout: post
title: Facts App on Laravel
tags: archived-from-wp-backup, notes
createdAt: 2014-01-18 14:23:54
layout: post
---

Facts App on Laravel
--------------------
Started my internship at MXIT, India (an awesome place to work!) a few days back and as a part of the training, I was asked to create a mobi-portal-application on the MXIT platform for sharing "facts" (the did-you-know kind). There are two parts for the app - a front-end and a back-end. The front-end has to be a basic for-WAP designed page which shows the user a set of categories to view facts of, and since it's meant to be for feature-phones too - the number of facts per page have to be limited to one or two. Each fact should have a 'like-dislike' rating along with an option to report a fake fact. Alongside there should be a way through which facts can be submitted by the viewer.

Coming to the back-end of the app, it's mainly for the admins to add/approve/disapprove and maintain the facts /categories - and this is done via a browser, so it should be better looking than the front-end (the wap thing really limits design to a bare minimum).

All this sounds simple to do in beginner php, but I planned to use a framework and got myself searching for one. Sitepoint recently did a <a title="Best PHP Frameworks 2014" href="http://www.sitepoint.com/best-php-frameworks-2014/" target="_blank">survey</a> of the best php frameworks available and there was a clear majority for Laravel leading with 1/4th of the votes. Surely my choice was obvious for I had no previous background in this area.
I had no idea what composer was and the quick start on the laravel docs made the process look a bit daunting. But after searching for ways without using composer (I have a shared hosting without pre-configured shell access and I was too lazy to ask for one, hence wanted to do without using ssh), I figured that composer was the easiest way to do, and surprisingly it was very simple!
After installing laravel, I set out to find free books and tutorials to help me out and ended up finding a bunch of them. But since most were for version 3, I ran into a lot of issues which I cleared out using the docs available on the site itself and then after a few tuts, I felt the site documentation along with the api docs was more than enough.

Coming back to the project at hand, creating it using laravel is real fun! The MVC has been excellently designed, with the Eloquent models, the blade template engine and routing that simplifies your tasks so very easily! Eloquent makes query handling soooo simple, I just had to fall in love with it! Pagination is truly a breeze, just as the site claims! Coming back again to the implementation - I have three tables (or objects): categories, facts and ratings. Categories has a one to many relationship with facts, a hasMany in laravel's lingo. The same goes with facts and ratings - each fact hasMany ratings associated with it.

Will be back to continue