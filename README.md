# accelerometer
McCook Magic

The point of this project was to create a gesture recognition library so you could import gestRec.js and have an easy way to execute code based on a flip/flick/twist/etc without having to implement the recognition code. Last time this code was touched was ~3 years ago so it's possible some things have changed...

For Captain McCook, I'd recommend getting the mobile and desktop pages talking to each other because then you can see all of the raw data and modify things from there. You might need to run things from a server if this is the path you go down with the idea being you will navigate directly to the IP of the computer you are hosting the code from on your mobile device. For example, if your laptop had an IP of 10.0.0.4, then you would run a local server (https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) from this directory and then on the mobile device, visit 10.0.0.4:8000 or whatever the port number happens to be.


## Structure

desktop/
* index.html - Visit to explore the realtime data from the mobile device. Should graph the accelerometer data if all goes according to plan. Utilizes WebRTC to make the pairing between the mobile page and the desktop
* magic.js - Data and graphing magic

mobile/
* index.html - Visit to record and transmit the motion data of the mobile device to the desktop
* magic.js - Data magic

safari/
* index.html - I think this was a version that worked on an iPad that was also capable of receiving and graphing the data from the mobile? Haven't looked closely at the code differences between the safari and desktop folders
* magic.js - Data and graphing magic

stackOverflow/
* No idea what I was doing here...

gestRec.js
* Initial library which I think should be working

index.html
* Generic playground that loads the library and logs all device motion to the console