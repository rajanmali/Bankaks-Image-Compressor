# PROBLEM STATEMENT:

A user on the Bankaks mobile platform wants to upload a picture on their profile for
which he is allowed to take their picture using their mobile phone. The picture that
the phone camera takes is directly uploaded on a Blob storage platform. A typical
image captured by a cell-phone camera is 3 to 9 Mb. Over the slow networks, loading
such a big image leads to bad UX and affects the user retention on the application.
In order to reduce the image load time, an image uploaded by the User should be
saved on the cloud in multiple sizes.
For example, a user takes an image from their phone which is 4290 x 2800 px in
size. The user taps on the upload button in the mobile application and the image is
reduced to 214.5 x 140 px and 429 x 280 px before uploading all three versions on
the cloud.
