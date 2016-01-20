---
layout: post
title: Creating Images with MATLAB
tags: archived-from-wp-backup, geek-lessons
createdAt: 2012-04-27 20:22:33
layout: post
---

Creating Images with MATLAB
---------------------------
Ok, last article is a prerequisite for this one – so please go through that if you do not know the basics of how pixels are arranged in an image.

To start with, we are going to create a nice little ‘spherical light’ using basic maths and then proceed to create a ‘hypnotising’ animation using a little advanced maths – and all of this in MATLAB.

MATLAB looks at images as a matrix containing pixels, so manipulating them will be easy.
<p style="padding-left: 30px;">A basic jpg image will be seen as a height x width x 3 matrix, which means it’s a 3D matrix of three layers deep with each layer specifying a channel (Red, Green and Blue).</p>
<p style="padding-left: 30px;">An indexed image (like a .gif for example) will be a 2D height x width matrix with an extra property called a ‘map’. The 2D matrix is called an intensity matrix which contains a grey scale version of the image. Whites are denoted by high values (1s if the matrix’s a double type, 255s if it’s a uint8 [unsigned integer – 8bit] type) and blacks by low values (0s). And of course the values in between denote different shades of grey. A map is another matrix (mx3 matrix, m variable and 3 = RGB) which associates each value in the grey scale matrix with a color. Hence you get a color image as a product. This method of imaging is used in heat imaging, where you just get the greyscale (intensity), and you map it with a predefined set of colors.</p>
<a href="/static/wordpress-imgs/2012/04/sphere.jpg"><img class="aligncenter size-full wp-image-61" title="sphere light" src="/static/wordpress-imgs/2012/04/sphere.jpg" alt="" width="510" height="510" /></a>

&nbsp;

Let’s get started:
<ol>
	<li>Start by creating a 1000x1000 matrix (call it B) and fill it up with 0s. This matrix is later going to contain the image. (If you want, you can execute imshow(B) and see how the image looks like now – should be totally black)</li>
	<li>Start a loop in a loop with x and y as variables and in it, define a variable z which measures up the distance from the centre of the image</li>
	<li>To get the above effect, we are using the function |x<sup>-1</sup>|. The graph looks like this, with a central peak, which is what we want – a maximum in the middle and diminishing as we move away.<a href="/static/wordpress-imgs/2012/04/x-inverse.jpg"><img class="aligncenter size-medium wp-image-66" title="X inverse" src="/static/wordpress-imgs/2012/04/x-inverse.jpg?w=300" alt="X inverse" width="300" height="224" /></a></li>
	<li>To avoid any divide-by-zero errors, lets remove the case by using if statements</li>
	<li>To view the image, use ‘imtool(B, “InitialMagnification”,100)’ which sets the initial magnification to 100%</li>
</ol>
The code:

```
m = 1000;
B = zeros(m,m);
for y=1:m
for x=1:m
z=sqrt((m*.5-x)^2 + (m*.5-y)^2);
if z~=0           
B(x,y)=(10/z);
else
B(x,y)=1;
end
end
end
imtool(B,'InitialMagnification',100);
```

If you change the value of the numerator in 10/z, you will be getting different intensities. A 100/z will fill out nicely and a 1/z will look like a dot.

Yes, that was simple indeed. Now we’ll see how to achieve this animation using a similar technique:

<a href="/static/wordpress-imgs/2012/04/anim.gif"><img class="aligncenter size-full wp-image-62" title="fourier animation" src="/static/wordpress-imgs/2012/04/anim.gif" alt="fourier animation" width="100" height="100" /></a>

First, let’s examine some plots of Fourier transforms of a rect-function. The parameter changing here is the pulse width of the square function. And for each width, we obtain a different graph with different number of peaks in an interval. As the pulse width increases, the number of peaks increase. We are going to make use of this property in getting these frames.

<a href="/static/wordpress-imgs/2012/04/frames.jpg"><img class="aligncenter size-full wp-image-63" title="fourier frames" src="/static/wordpress-imgs/2012/04/frames.jpg" alt="" width="500" height="100" /></a>

<a href="/static/wordpress-imgs/2012/04/fouriergraph2.jpg"><img class="aligncenter size-full wp-image-64" title="fourier transform graph" src="/static/wordpress-imgs/2012/04/fouriergraph2.jpg" alt="" width="510" height="243" /></a>

```
m = 100;
B = zeros(m,m,1,8);
t=-10:0.01:10;
i=1;
for pulseW= [0.1,0.25,0.5,0.75,1]
y=(t&gt;-pulseW&amp;t&lt;pulseW);
ft=abs(fft(y));
for y=(1):(m)
for x=(1):(m)
z=sqrt((m*.5-x)^2 + (m*.5-y)^2);
B(x,y,1,i)=((ft(round(z)+1000)));
end
end
i=i+1;
end
for i=6:8
B(:,:,:,i)=B(:,:,:,10-i);
end
[X map]=gray2ind(B,256);
mov = immovie(X,map);
imwrite(X,map,'anim.gif','gif','DelayTime',0.05,'LoopCount',Inf);
implay(mov);
```

Explaining the code:
<ol>
	<li>We are going to work with a smaller matrix as it is going to occupy less memory. Don’t try to work with huge ass matrices, your system <strong>WILL </strong>crash. Define B to be a 100x100x1x8 matrix. Why? The 100x100 is the size of the image, and the 1 is the number of channels, the 8 being the number of frames. This 4D matrix represents a multiframe image.</li>
	<li>Now defining the time interval from -10 to 10 with 2000 points in middle to get a proper transform.</li>
	<li>Next define the pulse widths in another matrix, pulseW.</li>
	<li>We are now going use this matrix to loop, to get the first five frames of the image. For each loop, we are using the pulse width from this matrix and get a Fourier Transform of the rect-function.</li>
	<li>Next, as done previously, create two loops with x and y and define z as the distance from the centre of the image. ‘ft’ contains the transform values. Offset it by 1000 to get values near zero. Put the value in in a pixel in B.</li>
	<li>After all these loops, we need to copy the 4<sup>th</sup>, 3<sup>rd</sup> and the 2<sup>nd</sup> frames into the 6<sup>th</sup>, 7<sup>th</sup> and 8<sup>th</sup> frames to get a smooth animation.</li>
	<li>The last few lines are to get the output properly. ‘gray2ind’ converts B which is a greyscale matrix into an index matrix (X) along with a map.</li>
	<li>‘immovie’ creates a movie sequence from the multiframe image. To play the movie, we use ‘implay’.</li>
	<li>‘imwrite’ is used to get the gif output. The parameters are set so that the frame rate is 20fps (i.e., 0.05s between each frame) and the animation goes on forever.</li>
</ol>
Thanks for reading!

The next episode will take a considerable time, and I didn't even plan a topic yet.